function ProductCardGrid({ products }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {products.map((product) => (
                <div
                    key={product.name}
                    className="bg-white rounded-lg shadow-sm p-6 transform hover:scale-105 transition-transform duration-200 ease-in-out border border-gray-100"
                >
                    <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                    <p className="mb-1">
                        類別：<span className="font-bold text-blue-700">{product.category}</span>
                    </p>
                    <p className="mb-2">
                        價格：<span className="font-bold text-green-600">NT${product.price.toFixed(2)}</span>
                    </p>
                    <p className={`px-2 inline-flex leading-5 font-semibold rounded-full ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {product.inStock ? '有庫存' : '無庫存'}
                    </p>
                </div>
            ))}
        </div>
    );
}

export default ProductCardGrid;