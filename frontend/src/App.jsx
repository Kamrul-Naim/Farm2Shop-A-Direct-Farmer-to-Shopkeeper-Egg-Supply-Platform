import React, { useContext } from 'react'
import { Routes,Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AppContext } from './context/AppContext';
import HowItWorks from './components/HowItWorks';
import ForFarmers from './components/ForFarmers';
import ForShopkeepers from './components/ForShopkeepers';
import About from './components/About';
import Registration from './pages/Registration';


const App = () => {

  const {roleState}=useContext(AppContext)

  function roles(){
    if(roleState===''){
      return(
        <>
          <Route path='/how-it-works' element={<HowItWorks/>}/>
          <Route path='/for-farmers' element={<ForFarmers/>}/>
          <Route path='/for-shopkeepers' element={<ForShopkeepers/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/register' element={<Registration/>}/>
        </>
      )
    }
  }



  return (
    <>
    <Navbar/>
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home/>}/>
        {roles()}
      </Routes>
    </div>
    <Footer/>
    </>
  )
}

export default App