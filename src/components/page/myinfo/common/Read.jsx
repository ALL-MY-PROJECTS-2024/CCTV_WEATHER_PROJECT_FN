import Layout from "../../../layout/Layout"
import "../../../../styles/myinfo/common/Read.scss"

import {Link} from "react-router-dom"
const read = ()=>{


    return (
        <Layout>
            <section className="myinfo-read">
                <div className="left">
                    {/* 일반 */}

                    {/* 강사전용 */}
                    <Link to="/myinfo/lecture/list">나의 강의 관리</Link>

                    {/* 관리자 */}

                </div>
                <div className="right"></div>
            </section>
        </Layout>
    )
}

export default read;