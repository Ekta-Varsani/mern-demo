import React, { memo, useState } from 'react';
import { Modal } from "react-bootstrap";

const UserDetail = (props) => {

    const [userDetail, setUserDetail] = useState(props.userDetail ? props.userDetail : {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: ''
    });
    const [file, setFile] = useState()
    const validations = {
        firstName: userDetail.firstName && userDetail.firstName.length >= 1,
        lastName: userDetail.lastName && userDetail.lastName.length >= 1,
        phoneNumber: (userDetail.phoneNumber && userDetail.phoneNumber.length >= 8 && userDetail.phoneNumber.length <= 12),
        email: (userDetail.email && userDetail.email.length >= 1 && userDetail.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) ? true : false
    }
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const formData = new FormData()

    const onChange = (event) => {
        const name = event.target.name;
        if (name === "imageUrl") {
            let file = event.target.files[0]
            setFile(URL.createObjectURL(file));
            setUserDetail({
                ...userDetail,
                [name]: file,
            })
            formData.append(name, file)
        } else {
            const value = event.target.value;
            setUserDetail({
                ...userDetail,
                [name]: value,
            })
            formData.append(name, value)

        }
    }

    const onSubmit = (event) => {
        event.preventDefault();
        setIsFormSubmitted(true);

        let isFormValid = true;
        Object.keys(validations).map((data) => {
            if (isFormValid) {
                isFormValid = validations[data];
            }
            return data;
        })
        if (isFormValid) {
            for (const property in userDetail) {
                formData.append(property, userDetail[property])
            }
            if(userDetail._id) {
                formData.append('userId', userDetail._id)
                formData.delete('_id')
            }
            props.updateUserDetail(formData)
        }
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
                            <div className='row mb-2'>
                                <div className='col-4'>
                                    <label className='float-end'>First Name</label>
                                </div>
                                <div className='col-8'>
                                    <input className='form-control' type="text" onChange={onChange} name="firstName" value={userDetail.firstName} />
                                    {isFormSubmitted && !validations.firstName && <small className='text-danger'>Please enter first name</small>}
                                </div>
                            </div>
                            <div className='row mb-2'>
                                <div className='col-4'>
                                    <label className='float-end'>Last Name</label>
                                </div>
                                <div className='col-8'>
                                    <input className='form-control' type="text" onChange={onChange} name="lastName" value={userDetail.lastName} />
                                    {isFormSubmitted && !validations.lastName && <small className='text-danger'>Please enter first name</small>}
                                </div>
                            </div>
                            <div className='row mb-2'>
                                <div className='col-4'>
                                    <label className='float-end'>Email</label>
                                </div>
                                <div className='col-8'>
                                    <input className='form-control' type="text" onChange={onChange} name="email" value={userDetail.email} />
                                    {isFormSubmitted && !validations.email && <small className='text-danger'>Please enter first name</small>}
                                </div>
                            </div>
                            <div className='row mb-2'>
                                <div className='col-4'>
                                    <label className='float-end'>Phone</label>
                                </div>
                                <div className='col-8'>
                                    <input className='form-control' type="text" onChange={onChange} name="phoneNumber" value={userDetail.phoneNumber} />
                                    {isFormSubmitted && !validations.phoneNumber && <small className='text-danger'>Please enter first name</small>}
                                </div>
                            </div>
                            <div className='row mb-2'>
                                <div className='col-4'>
                                    <label className='float-end'>Image</label>
                                </div>
                                <div className='col-8'>
                                    <input className='form-control' type="file" onChange={onChange} name="imageUrl" accept="image/png,image/jpeg" />
                                    {file ? <img src={file} className='mt-2' height='100px' width='100px' alt='' />: userDetail.imageUrl ? <img src={`http://localhost:7000/${userDetail.imageUrl}`} alt='' className='mt-2' height='100px' width='100px' /> : null}
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                </div>

                <Modal.Footer>
                    <button type="button" className="btn btn-secondary " onClick={() => { props.setIsModal(false) }}>Close</button>
                    <button type="submit" className="btn btn-success">submit</button>
                </Modal.Footer>
            </form>
        </Modal>
    )
}

export default UserDetail