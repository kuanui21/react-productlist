import { useState, useEffect, useRef } from 'react';
import { FaSearch, FaRedo } from 'react-icons/fa';

function ProductFilterForm({
    allAvailableCategories,
    onApplyFilters,
    onResetFilters,
    currentAppliedFilters
}) {
    // 內部管理篩選條件的狀態
    const [searchTerm, setSearchTerm] = useState('');
    const [tempSelectedCategories, setTempSelectedCategories] = useState([]);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const [inStockOnly, setInStockOnly] = useState(false);
    const [sortBy, setSortBy] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10); // 每頁顯示的商品數量，預設10筆

    // 使用 useRef 來追蹤 currentAppliedFilters.categories 的前一個值
    const prevCategoriesRef = useRef(currentAppliedFilters.categories);

    // 當父組件的篩選條件改變時，同步到子組件
    useEffect(() => {
        setSearchTerm(currentAppliedFilters.searchTerm || '');
        setMinPrice(currentAppliedFilters.minPrice || '');
        setMaxPrice(currentAppliedFilters.maxPrice || '');
        setInStockOnly(currentAppliedFilters.inStockOnly || false);
        setSortBy(currentAppliedFilters.sortBy || '');
        setItemsPerPage(currentAppliedFilters.itemsPerPage || 10);

        // 只有當 currentAppliedFilters.categories 確實發生變化時，才更新 tempSelectedCategories
        // 使用 JSON.stringify 進行深度比較，以確保數組內容的變化也能被捕捉
        if (JSON.stringify(currentAppliedFilters.categories) !== JSON.stringify(prevCategoriesRef.current)) {
            setTempSelectedCategories(currentAppliedFilters.categories || []);
            // 更新 prevCategoriesRef
            prevCategoriesRef.current = currentAppliedFilters.categories;
        }

    }, [currentAppliedFilters]);

    // 處理類別勾選變化
    const handleCategoryChange = (e) => {
        const { value, checked } = e.target;
        if (value === 'all') { // 如果是「全選」勾選
            if (checked) {
                setTempSelectedCategories(allAvailableCategories); // 勾選全選，則所有類別都選上
            } else {
                setTempSelectedCategories([]); // 取消全選
            }
        } else { // 如果是單個類別勾選
            setTempSelectedCategories(prev => {
                const newCategories = checked ? [...prev, value] : prev.filter(category => category !== value);
                return newCategories;
            });
        }
    };

    // 搜尋按鈕點擊事件
    const handleSearchClick = () => {
        onApplyFilters({
            searchTerm: searchTerm.trim(), // 移除前後空白再傳給父組件
            resetPage: true // 重置頁碼
        });
    };

    // 價格確定按鈕點擊事件
    const handleApplyPriceFilter = () => {
        let newMinPrice = minPrice === '' ? '' : parseFloat(minPrice); // 保持空值，如果輸入為空
        let newMaxPrice = maxPrice === '' ? '' : parseFloat(maxPrice); // 保持空值，如果輸入為空

        // 驗證價格範圍
        if (isNaN(newMinPrice) || newMinPrice < 0) {
            newMinPrice = 0; // 設定為預設最低值
        }
        if (isNaN(newMaxPrice) || newMaxPrice > 100000) {
            newMaxPrice = 100000; // 設定為預設最高值
        }

        // 確保最低價格不高於最高價格
        if (newMinPrice !== '' && newMaxPrice !== '' && newMinPrice > newMaxPrice) {
            [newMinPrice, newMaxPrice] = [newMaxPrice, newMinPrice]; // 交換值
        }

        // 更新內部狀態，讓輸入框顯示校正後的值
        setMinPrice(newMinPrice.toString());
        setMaxPrice(newMaxPrice.toString());

        // 將應用後的價格傳遞給父組件
        onApplyFilters({
            minPrice: newMinPrice.toString(),
            maxPrice: newMaxPrice.toString(),
            resetPage: true // 重置頁碼
        });
    };

    // 類別選擇 確定
    const handleApplyCategories = () => {
        onApplyFilters({
            categories: tempSelectedCategories,
            resetPage: true // 重置頁碼
        });
    };

    // 類別選擇 取消
    const handleCancelCategories = () => {
        setTempSelectedCategories(currentAppliedFilters.categories); // 恢復到父組件原始的類別
    };

    // 處理庫存篩選變化
    const handleInStockChange = (e) => {
        const checked = e.target.checked;
        setInStockOnly(checked); // 更新內部狀態
        onApplyFilters({
            inStockOnly: checked,
            resetPage: true
        });
    };

    // 處理排序變化
    const handleSortChange = (e) => {
        const value = e.target.value;
        setSortBy(value); // 更新內部狀態
        onApplyFilters({
            sortBy: value,
            resetPage: true
        });
    };

    // 處理每頁顯示數量變化
    const handleItemsPerPageChange = (e) => {
        const value = Number(e.target.value);
        setItemsPerPage(value); // 更新內部狀態
        onApplyFilters({
            itemsPerPage: value,
            resetPage: true // 重置頁碼
        });
    };

    // 處理「重置所有篩選」按鈕點擊
    const handleResetAll = () => {
        setSearchTerm('');
        setMinPrice('');
        setMaxPrice('');
        setInStockOnly(false);
        setSortBy('');
        setItemsPerPage(10); // 重置為預設值
        onResetFilters(); // 通知父組件重置篩選狀態
    };

    return (
        <div className="bg-gray-50 p-2 rounded-lg shadow-sm mb-8 md:p-6">
            {/* 搜尋列 */}
            <div className="flex flex-col sm:flex-row gap-4 p-4 items-center">
                <div className="flex items-center w-full sm:w-auto flex-grow">
                    <input
                        type="text"
                        placeholder="輸入產品名稱..."
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearchClick();
                            }
                        }}
                    />
                    <button
                        onClick={handleSearchClick}
                        className="px-3 py-2 bg-sky-600 text-white rounded-r-lg hover:bg-sky-700 transition-colors duration-200 shadow-md text-base 
                            flex-grow-0 shrink-0 sm:px-5 cursor-pointer flex justify-center items-center gap-2"
                    >
                        <FaSearch />
                        <span>搜尋</span>
                    </button>
                </div>
                <button
                    onClick={handleResetAll}
                    className="px-5 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors duration-200 shadow-md text-base 
                        w-full sm:w-auto cursor-pointer flex justify-center items-center gap-2"
                >
                    <FaRedo />
                    <span>重置查詢條件</span>
                </button>
            </div>

            {/* 篩選選項區塊 */}
            <div className="flex flex-col">
                {/* 類別多選選項 */}
                <div className="flex p-4 border-b-2 border-gray-200">
                    <div className="flex flex-wrap gap-3 md:flex-row md:items-center md:flex-wrap md:gap-5">
                        <h3 className="font-bold text-lg text-gray-700 whitespace-nowrap sm:mb-0">類別：</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-5">
                            <div className="flex flex-wrap gap-x-4 gap-y-2 flex-grow">
                                {/* 全選 */}
                                <label key="all-categories" className="inline-flex items-center text-gray-800 whitespace-nowrap">
                                    <input
                                        type="checkbox"
                                        value="all"
                                        className="form-checkbox h-5 w-5 cursor-pointer"
                                        checked={tempSelectedCategories.length === allAvailableCategories.length && allAvailableCategories.length > 0} // 當所有類別都被選中時，全選勾選
                                        onChange={handleCategoryChange}
                                    />
                                    <span className="ml-2 text-base">全選</span>
                                </label>
                                {/* 類別選項 */}
                                {allAvailableCategories.map(category => (
                                    <label key={category} className="inline-flex items-center text-gray-800 whitespace-nowrap">
                                        <input
                                            type="checkbox"
                                            value={category}
                                            className="form-checkbox h-5 w-5 cursor-pointer"
                                            checked={tempSelectedCategories.includes(category)}
                                            onChange={handleCategoryChange}
                                        />
                                        <span className="ml-2 text-base">{category}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={handleApplyCategories}
                                className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors duration-200 text-sm font-medium w-auto cursor-pointer"
                            >
                                確定
                            </button>
                            <button
                                onClick={handleCancelCategories}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-200 text-sm font-medium w-auto cursor-pointer"
                            >
                                取消
                            </button>
                        </div>
                    </div>
                </div>

                {/* 價格範圍輸入框與庫存篩選 */}
                <div className="flex p-4">
                    <div className="flex flex-wrap gap-3 md:flex-row md:items-center md:flex-wrap md:gap-5">
                        {/* 價格範圍與確定按鈕 */}
                        <h3 className="font-bold text-lg text-gray-700 whitespace-nowrap">篩選：</h3>
                        <div className="flex items-center gap-3 md:mb-0 flex-grow-0 shrink-0">
                            <input
                                type="number"
                                placeholder="最低價"
                                className="p-1 bg-white border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-teal-500 w-[100px]"
                                value={minPrice}
                                onChange={e => setMinPrice(e.target.value)}
                                min="0"
                                max="100000"
                            />
                            <span className="text-gray-600">-</span>
                            <input
                                type="number"
                                placeholder="最高價"
                                className="p-1 bg-white border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-teal-500 w-[100px]"
                                value={maxPrice}
                                onChange={e => setMaxPrice(e.target.value)}
                                min="0"
                                max="100000"
                            />
                            <button
                                onClick={handleApplyPriceFilter}
                                className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors duration-200 text-sm font-medium whitespace-nowrap cursor-pointer"
                            >
                                確定
                            </button>
                        </div>

                        {/* 庫存篩選 */}
                        <div className="flex md:mb-0 flex-grow-0 shrink-0">
                            <label className="inline-flex items-center text-gray-800 whitespace-nowrap">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                                    checked={inStockOnly}
                                    onChange={handleInStockChange}
                                />
                                <span className="ml-2 text-base">有庫存</span>
                            </label>
                        </div>

                        {/* 排序選項 */}
                        <div className="flex items-center gap-3 md:mb-0 flex-grow-0 shrink-0">
                            <select
                                className="p-1 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 w-[140px] text-base cursor-pointer"
                                value={sortBy}
                                onChange={handleSortChange}
                            >
                                <option value="">預設排序</option>
                                <option value="price-asc">價格 (低到高)</option>
                                <option value="price-desc">價格 (高到低)</option>
                            </select>
                        </div>

                        {/* 每頁顯示數量選項 */}
                        <div className="flex items-center gap-3 flex-grow-0 shrink-0">
                            <select
                                className="p-1 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 w-[140px] text-base cursor-pointer"
                                value={itemsPerPage}
                                onChange={handleItemsPerPageChange}
                            >
                                <option value={10}>每頁 10 筆</option>
                                <option value={20}>每頁 20 筆</option>
                                <option value={50}>每頁 50 筆</option>
                            </select>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    )

}

export default ProductFilterForm;