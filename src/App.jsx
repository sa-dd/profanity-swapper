import React from 'react'
import ProfanityFilterUI from './components/ProfanityFilterUI'
import PreferencesPage from './components/PreferencesPage'
import ExamplesPage from './components/ExamplesPage'
import FilteringSettingsPage from './components/FilteringSettingsPage'
import FlagFeedbackPage from './components/FlagFeedbackPage'
import TextAnalysisPage from './components/TextAnalysisPage'
import MainPage from "./components/MainPage"
function App() {
  return (
    <div className="w-[400px] h-[600px] bg-gray-900 text-white">
      {/* You can set up routing here if needed */}
      <MainPage/>
      {/* <PreferencesPage /> */}
      {/* <ExamplesPage /> */}
      {/* <FilteringSettingsPage /> */}
      {/* <FlagFeedbackPage /> */}
      {/* <TextAnalysisPage /> */}
    </div>
  )
}
export default App

