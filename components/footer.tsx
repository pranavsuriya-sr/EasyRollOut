import { Facebook, Twitter, Instagram } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-4 mt-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p>Contact: pranavsuriya.sr@gmail.com</p>
          <p>Phone: (123) 456-7890</p>
        </div>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-gray-300">
            <Facebook size={24} />
          </a>
          <a href="#" className="hover:text-gray-300">
            <Twitter size={24} />
          </a>
          <a href="#" className="hover:text-gray-300">
            <Instagram size={24} />
          </a>
        </div>
        <div className="mt-4 md:mt-0">
          <p>&copy; 2025 Easy Roll Out. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

