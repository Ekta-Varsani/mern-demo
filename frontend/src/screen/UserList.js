/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useCallback, useEffect, useState } from "react"
import useHttp from "../Hooks/HttpHook";
import { POST_METHOD } from "../Constants/HttpMethods";
import UserDetail from "./UserDetail";
import defaultImage from "../userimage.jpg"
import deleteImage from "../delete.png"
import editImage from "../edit.png"
import ResponsivePagination from 'react-responsive-pagination';
import { Modal } from "react-bootstrap";

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
    const [totalPages, setTotalPages] = useState(1);
    const [isDeleteModal, setIsDeleteModal] = useState(false)
    let numberOfRecord = 2;

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
                setUserList(data.responseData)
                let totalPage = Math.ceil(data.count / numberOfRecord)
                setTotalPages(totalPage)
                // setTotalPages(Array(totalPage).fill((x, i) => i).map((x, i) => i + 1));
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
        if(detail.has("userId")) {
            sendRequest({
                url: POST_METHOD.updateUser,
                method: 'POST',
                body: detail,
                showErrorToast: true,
                showSuccessToast: true,
                isShowLoading: true,
                isHideLoading: true,
                isFormData: true
            }, (data) => {
                if (data.success) {
                    getUserList(searchConfig)
                    setIsModal(false)
                } else {
                    setIsModal(false)
                }
            });
        } else {
            sendRequest({
                url: POST_METHOD.addUser,
                method: 'POST',
                body: detail,
                showErrorToast: true,
                showSuccessToast: true,
                isShowLoading: true,
                isHideLoading: true,
                isFormData: true
            }, (data) => {
                if (data.success) {
                    getUserList(searchConfig)
                    setIsModal(false)
                } else {
                    setIsModal(false)
                }
            });
        }
    }

    const onDeleteUser = () => {
        sendRequest({
            url: POST_METHOD.deleteUser,
            method: 'POST',
            body: { userId: userDetail._id },
            showErrorToast: true,
            showSuccessToast: true,
            isShowLoading: true,
            isHideLoading: true
        }, (data) => {
            if (data.success) {
                getUserList(searchConfig)
                setIsDeleteModal(false)
                setUserDetail(null)
            } else {
                setIsDeleteModal(false)
            }
        });
    }

    const onCreateProduct = () => {
        sendRequest({
            url: POST_METHOD.stripeCheckout,
            method: 'POST',
            body: {},
            showErrorToast: true,
            showSuccessToast: true,
            isShowLoading: true,
            isHideLoading: true,
            isFormData: true
        }, (data) => {
            if (data.success) {
                console.log(data)
            } else {
                console.log(data)
            }
        });
    }

    return (
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
                    <button className="btn btn-dark float-end" onClick={() => { setIsModal(true); setUserDetail(null) }}>Add +</button>
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
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            userList.length > 0 ? userList.map((data, i) => (
                                <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{data.firstName} {data.lastName}</td>
                                    <td><img className="rounded-circle" src={data.imageUrl !== '' ? 'http://localhost:7000/' + data.imageUrl : defaultImage } height="50px" width="50px" alt="" /></td>
                                    <td>{data.email}</td>
                                    <td>{data.phoneNumber}</td>
                                    <td><a href="javascript:void(0);" onClick={() => showUserDetail(data)}><img src={editImage} height="25px" width="25px" alt="" /></a> <a href="javascript:void(0);" onClick={() => {setIsDeleteModal(true); setUserDetail(data)}}><img src={deleteImage} height="25px" width="25px" alt="" /></a>
                                    </td>
                                </tr>
                            )) : <div className="mt-3 d-flex justify-content-center">No data found</div>
                        }
                    </tbody>
                </table>
            </div>
            {/* <nav aria-label="...">
                <ul className="pagination">
                    {totalPages.length > 0 && <li className={currentPage === 1 ? 'page-item disabled' : 'page-item'}>
                        <a className="page-link" href="#!" onClick={() => { setCurrentPage(currentPage - 1) }} aria-disabled="true">«</a>
                    </li>}
                    {totalPages.map((page) => (
                        <li key={page} className={page === currentPage ? 'page-item active' : 'page-item'} aria-current="page" onClick={() => { setCurrentPage(page) }}>
                            <a className="page-link" href="#!">{page}
                                {page === currentPage && <span className="visually-hidden">(current)</span>}
                            </a>
                        </li>
                    ))}
                    {totalPages.length > 0 && <li className={currentPage === totalPages.length ? 'page-item disabled' : 'page-item'}>
                        <a className="page-link" href="#!" onClick={() => { setCurrentPage(currentPage + 1) }}>»</a>
                    </li>}
                </ul>
                    </nav> */}
                    <ResponsivePagination
                        current={currentPage}
                        total={totalPages}
                        onPageChange={setCurrentPage}
                    />
            {isModal && <UserDetail userDetail={userDetail} updateUserDetail={updateUserDetail} setIsModal={setIsModal} />}

            <Modal dialogClassName="modal-90w" className="modal fade right" show={isDeleteModal} onHide={() => { setIsDeleteModal(false) }}>
            <form onSubmit={onDeleteUser} className="d-flex flex-column justify-content-between" style={{ 'height': 'inherit' }}>
                <div>
                    <Modal.Header>
                        <h6>Delete User ()</h6>
                        <button type="button" className="btn-close" onClick={() => { setIsDeleteModal(false) }}  ></button>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete the user?
                    </Modal.Body>
                </div>

                <Modal.Footer>
                    <button type="button" className="btn btn-secondary " onClick={() => { setIsDeleteModal(false) }}>Close</button>
                    <button type="submit" className="btn btn-danger">Delete</button>
                </Modal.Footer>
            </form>
        </Modal>
        </div>
    )
}

export default UserList