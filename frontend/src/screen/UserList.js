import { useCallback, useEffect, useState } from "react"
import useHttp from "../Hooks/HttpHook";
import { POST_METHOD } from "../Constants/HttpMethods";
import UserDetail from "./UserDetail";

function UserList() {
    const { sendRequest } = useHttp()
    const [searchConfig, setSearchConfig] = useState({
        searchField: 'firstName',
        searchValue: ''
    })
    const [userList, setUserList] = useState([]);
    const [userDetail, setUserDetail] = useState(null);
    const [isModal, setIsModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [data, setData] = useState([]);
    const [totalPages, setTotalPages] = useState([]);
    const [userPageType, setUserTabType] = useState(1);
    const [totalCount, setTotalCount] = useState(1)
    let numberOfRecord = 10;

    const onChangeSearchConfig = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setSearchConfig({
            ...searchConfig,
            [name]: value,
        })
    }

    const getUserList = useCallback(searchConfig => {
        sendRequest({
            url: POST_METHOD.userListSearchSort,
            method: 'POST',
            body: {
                page: currentPage,
                numberOfRecord: numberOfRecord,
                ...searchConfig
            }
        }, (data) => {
            if (data.success) {
                console.log(data);
                setUserList(data.responseData)
                setTotalCount(data.count)
                let totalPage = Math.ceil(data.count / numberOfRecord)
                setTotalPages(Array(totalPage).fill((x, i) => i).map((x, i) => i + 1));
            } else {
                setUserList([])
                setTotalPages([])
            }
        })
    }, [sendRequest, currentPage, numberOfRecord])

    useEffect(() => {
        getUserList(searchConfig)
    }, [getUserList])

    const onReset = () => {
        setSearchConfig({
            searchField: 'firstName',
            searchValue: ''
        })
        getUserList({
            searchField: 'firstName',
            searchValue: ''
        });
    }

    const showUserDetail = (data) => {
        setUserDetail(data)
        setIsModal(true)
    }

    const updateUserDetail = (detail) => {
        // sendRequest({
        //     url: POST_METHOD.updateUser,
        //     method: 'POST',
        //     body: { ...detail, userId: detail._id },
        //     showErrorToast: true,
        //     showSuccessToast: true,
        //     isShowLoading: true,
        //     isHideLoading: true
        // }, (data) => {
        //     if (data.success) {
        //         let index = userList.findIndex((x) => x._id === detail._id);
        //         if (index !== -1) {
        //             userList[index] = detail;
        //             setUserList(userList)
        //         }
        //         setIsModal(false)
        //     } else {

        //     }
        // });
    }

    return <>
        <div className="container mt-5">
            <div className="row mb-3">
                <div className="col-md-6 col-lg-3 col-xl-3">
                    <select value={searchConfig.searchField} name="searchField" className="form-select" onChange={onChangeSearchConfig}>
                        <option value="firstName">Name</option>
                        <option value="phoneNumber">Phone</option>
                        <option value="email">Email</option>
                    </select>
                </div>
                <div className="col-md-6 col-lg-3 col-xl-3">
                    <input type="text" value={searchConfig.searchValue} className="form-control" onChange={onChangeSearchConfig} name="searchValue" placeholder='Search here' />
                </div>
                <div className="col-md-6 col-lg-4 col-xl-4">
                    <div className="row">
                        <div className="col-2">
                            <button type="button" className="btn btn-dark" onClick={getUserList.bind(null, searchConfig)}>Search</button>
                        </div>
                        <div className="col-4">
                            <button type="button" className="btn btn-outline-dark " onClick={onReset}>Reset
                            </button>

                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-lg-2 col-xl-2">
                    <button className="btn btn-dark float-end" onClick={() => { setIsModal(true) }}>Add +</button>
                </div>
            </div>
            <div className="row">
                <table className="table table-responsive">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Image</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            userList.length > 0 ? userList.map((data, i) => (
                                <tr>
                                    <td>{i + 1}</td>
                                    <td>{data.firstName} {data.lastName}</td>
                                    <td><img src={data.imageUrl != '' ? 'http://localhost:7000/' + data.imageUrl : ''} height="50px" width="50px" /></td>
                                    <td>{data.email}</td>
                                    <td>{data.phoneNumber}</td>
                                    <td><button className="btn btn-sm btn-outline-dark" onClick={() => showUserDetail(data)}>Edit</button></td>
                                </tr>
                            )) : <div className="mt-3 d-flex justify-content-center">No data found</div>
                        }
                    </tbody>
                </table>
            </div>
        </div>
        {isModal && <UserDetail userDetail={userDetail} updateUserDetail={updateUserDetail} setIsModal={setIsModal} />}
    </>
}

export default UserList