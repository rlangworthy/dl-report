
import * as React from 'react'
import axios from 'axios'
import {
    useGoogleLogin,
    } from '@react-oauth/google'

//import { ReportHome } from './report'
import {GoogleDownload} from './gapi'
/*
interface SignInState {
    log: 'New' | 'Form' | 'Signed'
    account: AxiosResponse //add axios types
}*/

interface SignInProps {
    //success: (response: GoogleLoginResponse | GoogleLoginResponseOffline) => void
    //failure: (response: GoogleLoginResponse | GoogleLoginResponseOffline) => void
    setState: (state: any) => void  // eslint-disable-line @typescript-eslint/no-explicit-any
}

export function SignInWrapper() {
    const [state, setState]  = React.useState({log: 'New', account: ''})

    if( state.log === 'New'){
        return <LoginPage setState={setState}></LoginPage>
    }
    else{
        return (
            <></>
        )
    }

}

export function LoginPage(props: SignInProps) {


    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            //console.log(tokenResponse);
            const userInfo = await axios.get(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            { headers: { Authorization: 'Bearer '+ tokenResponse.access_token }},
            );
            const email = userInfo.data.email
            if(email.split('@')[email.split('@').length-1] === 'cps.edu'){

                props.setState({log:'Form', account: email})
            }
            //console.log(userInfo);
        },
        onError: errorResponse => console.log(errorResponse),
        });


    return (
        <>
            <button onClick={e => {
                e.preventDefault()
                googleLogin()
                }}>
                Login with Your CPS Email
            </button>
            <GoogleDownload/>
            
        </>
    )
}
