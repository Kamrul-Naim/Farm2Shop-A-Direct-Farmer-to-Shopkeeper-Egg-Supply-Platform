import React from 'react'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import ForFarmers from '../components/ForFarmers'
import ForShopkeepers from '../components/ForShopkeepers'
import WhyFarm2Shop from '../components/WhyFarm2Shop'
import About from '../components/About'
import JoinFarm2Shop from '../components/JoinFarm2Shop'

const Home = () => {
  return (
    <>
        <Hero/>
        <HowItWorks/>
        <ForFarmers/>
        <ForShopkeepers/>
        <WhyFarm2Shop/>
        <About/>
        <JoinFarm2Shop/>
    </>
  )
}

export default Home