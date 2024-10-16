
import {requestJoin} from "../../../services/AuthService"
import {useState} from "react"

import Layout from "../../layout/Layout";


const Join = ()=>{

    const [username,setUsername] = useState();
    const [password,setPassword] = useState();

    const joinHandler = async (e)=>{
        e.preventDefault();
        console.log("JOIN...")
        const response = await requestJoin(username,password);
        console.log('POST /join...',response)

    }
    return (

        <Layout>
            <section>
                <form action="">
                    <div>
                        USERNAME :<input type="text" name="username" onChange={(e)=>{setUsername(e.target.value)}} />
                    </div>
                    <div>
                        PASSWORD :<input type="password" name="password" onChange={(e)=>{setPassword(e.target.value)}}  />
                    </div>
                    <div>
                        <button onClick={(e)=>{joinHandler(e)}}>회원가입</button>
                    </div>
                </form>
            </section>
        </Layout>


    )

}

export default Join;