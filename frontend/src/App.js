import './App.css';
import UserList from './screen/UserList';
import { Toast } from "react-bootstrap";
import { useSelector, useDispatch } from 'react-redux'
import { toastActions } from './Redux/Reducers/ToastReducer'
import socket from './socket';

function App() {
  const dispatch = useDispatch();
  const {ToastConfig, LoaderConfig} = useSelector(state => state);

  // socket.on('connect', () => {
  //   console.log('connected');
  //   // setIsConnected(true);
  // });

  // socket.on('logOut', (arg, callback) => {
  //   console.log(arg)
  //   callback({name: 'ekta varsani'})
  // })

  const hideToast = () =>{
    dispatch(toastActions.hideToast())
  }
  return (
    <div className="App">
      <UserList />
      {ToastConfig.isShowToast && <Toast style={{position:"absolute",top:10,right:10}} className={`d-flex align-items-center text-white ${ToastConfig.className} border-0 fade show`}>
          <Toast.Body>
            {ToastConfig.message}
          </Toast.Body>
          <button type="button" className="btn-close btn-close-white ms-auto me-2" onClick={hideToast} data-dismiss="toast" aria-label="Close"></button>
  </Toast> }
      {LoaderConfig.isShowLoading && 
        <div className="loader">
        </div>
      }
    </div>
  );
}

export default App;