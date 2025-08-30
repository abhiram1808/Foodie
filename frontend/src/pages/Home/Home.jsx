import React, { useState } from 'react'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import AppDownload from '../../components/AppDownload/AppDownload'

import FloatingChatbot from "../../components/FloatingChatbot/FloatingChatbot";
import ScrollToTopButton from "../../components/ScrollToTopButton";
// import FloatingToolsBar from "../../components/FloatingToolsBar/FloatingToolsBar";

const Home = () => {

  const [category,setCategory] = useState("All");
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <Header/>
      <ExploreMenu setCategory={setCategory} category={category}/>
      <FoodDisplay category={category}/>
      <AppDownload/>

       {/* Floating chatbot */}
      <FloatingChatbot />
       <ScrollToTopButton />
    </>
  )
}

export default Home
