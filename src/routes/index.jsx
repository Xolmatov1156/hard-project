import React from 'react'
import { Route, Routes } from 'react-router-dom'
import {Dashboard, Add} from '../pages'

function CustomRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Dashboard />} />
      <Route path='/add' element={<Add />} />
    </Routes>
  )
}

export default CustomRoutes