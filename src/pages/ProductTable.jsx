function ProductTable({ products }) {
    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                            名稱
                        </th>
                        <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                            類別
                        </th>
                        <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                            價格
                        </th>
                        <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                            庫存
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                        <tr key={product.name} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {product.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {product.category}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-semibold">
                                NT${product.price.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex leading-5 font-semibold rounded-full ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                    {product.inStock ? '有庫存' : '無庫存'}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ProductTable;