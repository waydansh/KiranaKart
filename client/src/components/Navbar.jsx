import React, { useState, useRef, useEffect } from 'react'; // Import useState and useRef
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const { user, setUser, setShowUserLogin, navigate, searchQuery, setSearchQuery, getCartCount } = useAppContext();

    const logout = async () => {
        setUser(null);
        navigate('/');
    }

    useEffect(() => {
        if (searchQuery.length > 0) {
            navigate('/products');
        }
    }, [searchQuery]);

    // --- START: Code for Sliding Hover Effect ---

    // State to hold the style for our sliding element
    const [sliderStyle, setSliderStyle] = useState({});

    // Ref for the container of the navigation links
    const navLinksRef = useRef(null);

    // Function to handle mouse entering a link
    const handleMouseEnter = (e) => {
        const linkElement = e.currentTarget;
        // Calculate position relative to the parent container (navLinksRef)
        const newStyle = {
            width: linkElement.offsetWidth,
            left: linkElement.offsetLeft,
        };
        setSliderStyle(newStyle);
    };

    // Function to handle mouse leaving the entire nav links container
    const handleMouseLeave = () => {
        // Reset the style to hide the slider
        setSliderStyle({});
    };

    // --- END: Code for Sliding Hover Effect ---

    return (
        <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">
            <NavLink to='/' onClick={() => setOpen(false)} className="flex items-center gap-2 h-9">
                <img src={assets.logo} alt="logo" />
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8">

                {/* --- START: Modified Nav Links Section --- */}

                {/* The container needs `position: relative` for the absolute slider to work.
                  We also add the ref and the mouse leave handler here.
                */}
                <div
                    ref={navLinksRef}
                    onMouseLeave={handleMouseLeave}
                    className="relative flex items-center gap-8"
                >
                    {/* The sliding element. It moves based on the sliderStyle state. */}
                    <div
                        className="absolute bg-primary-dull h-full rounded-full transition-all duration-300 ease-in-out -z-10"
                        style={{ ...sliderStyle, top: 0, zIndex: 0 }}
                    ></div>

                    {/* Each NavLink now needs `onMouseEnter`. The text color is always white, 
                      and the `z-index` ensures it appears above the slider.
                    */}
                    <NavLink to='/' onMouseEnter={handleMouseEnter} className='relative z-10 text-black hover:text-white px-1.75 py-0.5 transition-colors duration-300'>Home</NavLink>
                    <NavLink to='/products' onMouseEnter={handleMouseEnter} className='relative z-10 text-black hover:text-white px-1.75 py-0.5 transition-colors duration-300'>All Products</NavLink>
                    <NavLink to='/' onMouseEnter={handleMouseEnter} className='relative z-10 text-black hover:text-white px-1.75 py-0.5 transition-colors duration-300'>Contact</NavLink>
                </div>

                {/* --- END: Modified Nav Links Section --- */}

                <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
                    <input onChange={(e) => setSearchQuery(e.target.value)} className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500" type="text" placeholder="Search products" />
                    <img src={assets.search_icon} alt='search' className='w-4 h-4' />

                </div>

                <div onClick={() => navigate("cart")} className="relative cursor-pointer">
                    <img src={assets.cart_icon} alt='cart' className='w-6 h-6 opacity-80' />
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
                </div>

                {user ?
                    (
                        <div className='relative group'>
                            <img src={assets.profile_icon} className='w-10' />
                            <ul className='hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-30 rounded-md text-sm z-40'>
                                <li onClick={() => navigate("my-orders")} className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer' >My Orders</li>
                                <li onClick={logout} className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer' >Logout</li>
                            </ul>
                        </div>

                    ) :
                    (
                        <button onClick={() => setShowUserLogin(true)} className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full">
                            Login
                        </button>
                    )
                }
            </div>

            {/* The rest of your component remains the same */}

            {/* Mobile Menu */}

            <div className='sm:hidden flex items-center gap-6'>
                <div onClick={() => navigate("cart")} className="relative cursor-pointer">
                    <img src={assets.cart_icon} alt='cart' className='w-6 h-6 opacity-80' />
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
                </div>
                <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu" className="">
                    <img src={assets.menu_icon} alt='menu' />
                </button>
            </div>

            {open && (<div className={`${open ? 'flex' : 'hidden'} absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}>
                <NavLink to='/' onClick={() => setOpen(false)} className='text-black hover:text-primary'>Home</NavLink>
                <NavLink to='/products' onClick={() => setOpen(false)} className='text-black hover:text-primary'>All Products</NavLink>
                {user &&
                    <NavLink to='/products' onClick={() => setOpen(false)} className='text-black hover:text-primary'>My orders</NavLink>
                }
                <NavLink to='/contact' onClick={() => setOpen(false)} className='text-black hover:text-primary'>Contact</NavLink>

                {user ? (<button onClick={logout} className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm">
                    Logout
                </button>) : (<button onClick={() => {
                    setOpen(false);
                    setShowUserLogin(true);
                }} className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm">
                    Login
                </button>)}

            </div>)}
        </nav>
    );
};

export default Navbar;