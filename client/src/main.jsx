import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { store } from './redux/store.js'
import {Provider} from 'react-redux'


ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
// VITE_FIRE_BASE_API_KEY= "AIzaSyBKyhZ26E4ieA_HKxUTBx41DWhF9bm3YPc"