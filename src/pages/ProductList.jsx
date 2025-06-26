import { useState, useEffect, useCallback, useRef } from 'react';
import ReactPaginate from 'react-paginate'; // 分頁套件
import ProductTable from './ProductTable'; // 桌面端表格組件
import ProductCardGrid from './ProductCardGrid'; // 手機端卡片網格組件
import ProductFilterForm from './ProductFilterForm'; // 篩選功能組件

function ProductList() {
    const allProductsRef = useRef([]);
    const [products, setProducts] = useState([]);

    const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
    const [allAvailableCategories, setAllAvailableCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [appliedMinPrice, setAppliedMinPrice] = useState('');
    const [appliedMaxPrice, setAppliedMaxPrice] = useState('');

    const [inStockOnly, setInStockOnly] = useState(false);
    const [sortBy, setSortBy] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10); // 每頁顯示的商品數量，預設10筆

    // 分頁相關狀態
    const [currentPage, setCurrentPage] = useState(0);
    const [totalProductsCount, setTotalProductsCount] = useState(0); // 總產品數量，用於計算總頁數

    // RWD 相關狀態
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    // Loading 狀態
    const [isLoading, setIsLoading] = useState(true);
    // 數據是否已初始載入
    const [initialDataLoaded, setInitialDataLoaded] = useState(false);

    // 載入資料 (只在初始化時執行一次)
    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/items.json');
                const data = await response.json();
                allProductsRef.current = data; // 將數據賦值給 useRef

                const categoriesFromAllData = [...new Set(data.map(product => product.category))].sort();
                setAllAvailableCategories(categoriesFromAllData); // 設置所有可用類別
                setSelectedCategories(categoriesFromAllData); // 初始時選取所有類別

                setInitialDataLoaded(true); // 標記初始數據已載入
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        loadInitialData();
    }, []);


    // 模擬後端 API 呼叫的函數 (新增：包含所有篩選、排序、分頁邏輯)
    const fetchProductsFromApi = useCallback(async () => {
        // 如果初始數據尚未載入完成，則不執行篩選邏輯
        if (!initialDataLoaded) {
            return;
        }

        setIsLoading(true); // 開始載入

        // 模擬網路延遲
        await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 300)); // 0.3s - 0.8s 延遲

        let currentData = [...allProductsRef.current];

        // 1. 名稱關鍵字搜尋
        if (appliedSearchTerm) {
            currentData = currentData.filter(product =>
                product.name.toLowerCase().includes(appliedSearchTerm.toLowerCase())
            );
        }

        // 2. 類別篩選
        if (selectedCategories.length > 0) {
            currentData = currentData.filter(product =>
                selectedCategories.includes(product.category)
            );
        } else {
            currentData = []; // 沒有選取類別時不顯示任何產品
        }

        // 3. 價格範圍篩選
        const parsedAppliedMinPrice = parseFloat(appliedMinPrice);
        const parsedAppliedMaxPrice = parseFloat(appliedMaxPrice);

        if (!isNaN(parsedAppliedMinPrice)) {
            currentData = currentData.filter(product => product.price >= parsedAppliedMinPrice);
        }
        if (!isNaN(parsedAppliedMaxPrice)) {
            currentData = currentData.filter(product => product.price <= parsedAppliedMaxPrice);
        }

        // 4. 庫存篩選
        if (inStockOnly) {
            currentData = currentData.filter(product => product.inStock);
        }

        // 5. 排序
        currentData.sort((a, b) => {
            if (sortBy === 'price-asc') {
                return a.price - b.price;
            } else if (sortBy === 'price-desc') {
                return b.price - a.price;
            }
            return 0; // 預設不排序
        });

        // 模擬後端分頁邏輯
        const totalCount = currentData.length; // 篩選和排序後的總數
        const startIndex = currentPage * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedData = currentData.slice(startIndex, endIndex);

        setProducts(paginatedData); // 更新為當前頁的產品數據
        setTotalProductsCount(totalCount); // 更新總產品數量
        setIsLoading(false); // 結束載入
    }, [appliedSearchTerm, selectedCategories, appliedMinPrice, appliedMaxPrice, inStockOnly, sortBy, currentPage, itemsPerPage, initialDataLoaded]);

    useEffect(() => {
        fetchProductsFromApi();
    }, [fetchProductsFromApi]);

    // RWD 監聽視窗大小
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    // 處理來自 ProductFilterForm 的應用篩選回調
    const handleApplyFilters = useCallback((filters) => {
        const { searchTerm, categories, minPrice, maxPrice, inStockOnly, sortBy, itemsPerPage, resetPage } = filters;

        // 僅更新傳入的條件，未傳入的保持不變
        if (searchTerm !== undefined) setAppliedSearchTerm(searchTerm);
        if (categories !== undefined) setSelectedCategories(categories);
        if (minPrice !== undefined) setAppliedMinPrice(minPrice);
        if (maxPrice !== undefined) setAppliedMaxPrice(maxPrice);
        if (inStockOnly !== undefined) setInStockOnly(inStockOnly);
        if (sortBy !== undefined) setSortBy(sortBy);
        if (itemsPerPage !== undefined) setItemsPerPage(itemsPerPage);

        // 如果需要重置頁碼，則將當前頁碼設為 0
        if (resetPage) {
            setCurrentPage(0);
        }
    }, []);

    // 處理來自 ProductFilterForm 的重置所有篩選回調
    const handleResetFilters = useCallback(() => {
        setAppliedSearchTerm('');
        setSelectedCategories([...new Set(allProductsRef.current.map(product => product.category))].sort()); // 重置為所有類別
        setAppliedMinPrice('');
        setAppliedMaxPrice('');
        setInStockOnly(false);
        setSortBy('');
        setItemsPerPage(10); // 重置為預設值
        setCurrentPage(0); // 重置頁碼
    }, []);

    // 分頁邏輯
    const pageCount = Math.ceil(totalProductsCount / itemsPerPage);

    // 分頁器頁碼點擊處理
    const handlePageClick = useCallback((data) => {
        setCurrentPage(data.selected);
    }, []);

    return (
        <div className="container mx-auto p-4 min-h-screen">
            <h1 className="text-4xl font-extrabold mb-2 p-4 text-center text-gray-800">產品查詢</h1>

            {/* 篩選功能組件 */}
            <ProductFilterForm
                allAvailableCategories={allAvailableCategories}
                onApplyFilters={handleApplyFilters}
                onResetFilters={handleResetFilters}
                currentAppliedFilters={{
                    searchTerm: appliedSearchTerm,
                    categories: selectedCategories,
                    minPrice: appliedMinPrice,
                    maxPrice: appliedMaxPrice,
                    inStockOnly: inStockOnly,
                    sortBy: sortBy,
                    itemsPerPage: itemsPerPage
                }}
            />

            {/* 產品列表 */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-48 bg-white rounded-2xl shadow-md gap-3">
                    <div className="w-10 h-10 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 text-lg font-medium animate-pulse">資料載入中...</p>
                </div>
            ) : products.length === 0 ? ( // 如果沒有產品
                <p className="text-center text-gray-600 text-lg py-10 bg-white rounded-lg shadow-sm">沒有找到符合條件的產品。</p>
            ) : (
                <>
                    {/* 根據 isMobile 條件渲染不同組件 */}
                    {isMobile ? (
                        <ProductCardGrid products={products} />
                    ) : (
                        <ProductTable products={products} />
                    )}

                    {/* 分頁導航 */}
                    {pageCount > 1 && (
                        <div className="flex justify-center mt-8 mb-6">
                            <ReactPaginate
                                previousLabel={"<"}
                                nextLabel={">"}
                                breakLabel={"..."}
                                pageCount={pageCount}
                                marginPagesDisplayed={2} // 顯示當前頁碼左右各2個頁碼
                                pageRangeDisplayed={3} // 總共顯示的頁碼數量 (不包含 '...' 和首尾)
                                onPageChange={handlePageClick}
                                containerClassName={"pagination flex flex-wrap leading-8 items-center space-x-2"}
                                pageClassName={"page-item"}
                                pageLinkClassName={"page-link px-4 py-2 rounded-full font-medium text-gray-600 hover:bg-gray-300 cursor-pointer"}
                                previousClassName={"page-item"}
                                previousLinkClassName={"page-link px-4 py-2 rounded-lg font-medium text-gray-600 transition-colors cursor-pointer"}
                                nextClassName={"page-item"}
                                nextLinkClassName={"page-link px-4 py-2 rounded-lg font-medium text-gray-600 transition-colors cursor-pointer"}
                                breakClassName={"page-item"}
                                breakLinkClassName={"page-link px-4 py-2 rounded-lg font-medium text-gray-600 cursor-pointer"}
                                activeClassName={"active"}
                                activeLinkClassName={"page-link bg-sky-600 text-white shadow-md hover:text-gray-600 cursor-pointer"}
                                forcePage={currentPage} // 確保頁碼顯示與狀態同步
                            />
                        </div>
                    )}
                    <p className="text-gray-700 text-base text-center my-6">
                        共 {totalProductsCount} 筆產品
                    </p>
                </>
            )}
        </div>
    );
}

export default ProductList;