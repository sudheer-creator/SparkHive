import React from 'react'


const ChangePassword = () => {
    return (
        <div className='accountsettings'>
            <h1 className='mainhead1'>Change Password</h1>

            <div className='form'>
                <div className='form-group'>
                    <label htmlFor='oldpass'>Old Password <span>*</span></label>
                    <input type="password"
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor='newpass'>New Password <span>*</span></label>
                    <input type="password"
                    />
                </div>


            </div>

            <button className='bg-red-500 rounded px-4 py-3 text-white' style={{margin: "30px"}}

            >Save Changes</button>
        </div>
    )
}

export default ChangePassword