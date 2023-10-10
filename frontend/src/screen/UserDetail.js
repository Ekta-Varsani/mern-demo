import React, { memo, useState } from 'react';
import { Modal } from "react-bootstrap";

const UserDetail = (props) => {

    const [userDetail, setUserDetail] = useState(props.userDetail ? props.userDetail : {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: ''
    });
    const validations = {
        firstName: userDetail.firstName && userDetail.firstName.length >= 1,
        lastName: userDetail.lastName && userDetail.lastName.length >= 1,
        phoneNumber: (userDetail.phoneNumber && userDetail.phoneNumber.length >= 8 && userDetail.phoneNumber.length <= 12),
        email: (userDetail.email && userDetail.email.length >= 1 && userDetail.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) ? true : false
    }
    const [userPageType, setUserTabType] = useState(1);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);

    const onChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setUserDetail({
            ...userDetail,
            [name]: value,
        })
    }

    const onSubmit = (event) => {
        // event.preventDefault();
        // setIsFormSubmitted(true);

        // let isFormValid = true;
        // Object.keys(validations).map((data) => {
        //     if (isFormValid) {
        //         isFormValid = validations[data];
        //     }
        //     return data;
        // })
        // if (isFormValid) {
        //     props.updateUserDetail(userDetail)
        // }
    }

    return (
        <Modal dialogClassName="modal-90w" className="modal fade right" show="true" onHide={() => { props.setIsModal(false) }}>
            <form onSubmit={onSubmit} className="d-flex flex-column justify-content-between" style={{ 'height': 'inherit' }}>
                <div>
                    <Modal.Header>
                        <h6>User Detail</h6>
                        <button type="button" className="btn-close" onClick={() => { props.setIsModal(false) }}  ></button>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="card-body">
                            <div className='row'>
                                <div className='col-4'>
                                    <label className='float-end'>First Name</label>
                                </div>
                                <div className='col-8'>
                                    <input className='form-control' type="text" onChange={onChange} name="firstName" value={userDetail.firstName} />
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-4'>
                                    <label className='float-end'>Last Name</label>
                                </div>
                                <div className='col-8'>
                                    <input className='form-control' type="text" onChange={onChange} name="lastName" value={userDetail.lastName} />
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-4'>
                                    <label className='float-end'>Email</label>
                                </div>
                                <div className='col-8'>
                                    <input className='form-control' type="text" onChange={onChange} name="email" value={userDetail.firstName} />
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-4'>
                                    <label className='float-end'>Phone</label>
                                </div>
                                <div className='col-8'>
                                    <input className='form-control' type="text" onChange={onChange} name="phoneNumber" value={userDetail.firstName} />
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                </div>

                <Modal.Footer>
                    <button type="button" className="btn btn-secondary " onClick={() => { props.setIsModal(false) }}>Close</button>
                    <button type="submit" className="btn btn-primary">submit</button>
                </Modal.Footer>
            </form>
        </Modal>
    )
}

export default UserDetail