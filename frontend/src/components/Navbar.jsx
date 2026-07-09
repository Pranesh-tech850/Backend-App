import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {

    const {user, logout,cartCount} = useAuth();
    const navigate = useNavigate();



    const handleLogout = () => {
        logout();
        navigate("/login");
    }

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center py-4">
        <Link to="/" className="text-2xl font-bold hover:text-blue-200 transition">
          🛍️ Ecom Store
        </Link>
        
        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:text-blue-200 transition">
            Products
          </Link>
          
          <Link to="/cart" className="relative hover:text-blue-200 transition">
            🛒 Cart
              <span
    className="
      absolute
      -top-2
      -right-4
      bg-red-500
      text-white
      text-xs
      rounded-full
      w-5
      h-5
      flex
      items-center
      justify-center
    "
  >
    {cartCount}
  </span>
          </Link>
          
          
          {user ? (
            <>
             {user.isAdmin && (
                 <Link to="/admin" className="hover:text-blue-200 transition">
                 Admin
               </Link>
             )}  
             <span className='text-sm'>{user.name}</span>  
             <button onClick={handleLogout}
             className='bg-red-500 px-3 py-1 rounded hover:bg-red-600'>
                Logout
             </button>
            </>
          ): (
            <>
                <Link to="/login" className="hover:text-blue-200 transition">
                    Login
                </Link>
                <Link to="/register" className="bg-green-500 px-3 py-1 rounded hover:bg-green-600 transition">
                    Register
                </Link>
            </>
          )}
          
            
             
            
          
        </div>
      </div>
    </div>
  </nav>
  )
}

export default Navbar