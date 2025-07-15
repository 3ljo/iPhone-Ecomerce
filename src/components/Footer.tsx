import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">E</span>
              </div>
              <span className="text-lg font-bold text-white">Eljo Store</span>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Premium iPhone destination with cutting-edge technology and
              exceptional service.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Shop</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/products"
                  className="hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/accessories"
                  className="hover:text-white transition-colors">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/support"
                  className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="hover:text-white transition-colors">
                  Shipping
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="hover:text-white transition-colors">
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 Eljo Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
