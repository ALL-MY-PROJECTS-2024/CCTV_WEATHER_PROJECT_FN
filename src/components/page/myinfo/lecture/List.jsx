import Layout from "../../../layout/Layout"
import "../../../../styles/myinfo/lecture/List.scss"

import {Link} from "react-router-dom"
const read = ()=>{


    return (
        <Layout>
            <section className="myinfo-lecture-list">
                <div className="left">
                    <div className="one tag">
                            <ul>
                                <li classList="active"><a href="" >강의 목록</a></li>
                                <li><a href="/myinfo/lecture/post">강의 추가</a></li>
                                <li><a href="">강의 수정</a></li>
                                <li><a href="">강의 삭제</a></li>
                            </ul>
                    </div>
                </div>
                <div className="right">

                </div>
            </section>
        </Layout>
    )
}

export default read;