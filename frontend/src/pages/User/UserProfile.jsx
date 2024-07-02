import React from 'react'
import { useParams } from 'react-router-dom'
import UserSidebar from '../../Components/UserProfile/UserSidebar'
import AccountSettings from '../../Components/UserProfile/AccountSettings'
import ChangePassword from '../../Components/UserProfile/ChangePassword'
import YourOrders from '../../Components/UserProfile/YourOrders'
import UserAddress from '../../Components/UserProfile/UserAddress'
import LegalNotice from  '../../Components/UserProfile/LegalNotice'
import './UserProfile.css'


const UserProfile = () => {

    const {activepage} = useParams()


    // alert(activepage)
  return (
    <div className='userprofile'>
        {/* UserProfile , showing {activepage}
         */}

         <div className='userprofilein'>
            <div className='left'>
              <UserSidebar activepage={activepage}/>
            </div>
            <div className='right'>
              {activepage === 'accountsettings' && <AccountSettings/>}
              {activepage === 'changepassword' && <ChangePassword/>}
              {activepage === 'yourorders' && <YourOrders/>}
              {activepage === 'address' && <UserAddress/>}
              {activepage === 'legalnotice' && <LegalNotice/>}
            </div>
         </div>
        </div>
  )
}

export default UserProfile