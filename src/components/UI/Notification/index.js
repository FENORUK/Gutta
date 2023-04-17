import React from "react"
import moment from "moment/moment"
import "./index.css"
const Notification = (props) => {
    const { data } = props
    return (
        <div
            key={data.id}
            className=" flex   hover:bg-zinc-100 rounded-lg m-2 cursor-pointer mr-4 pl-2 p-2"
        >
            <div class="flex items-center mr-2 mb-2.5">
                <img
                    src="https://www.gravatar.com/avatar/aeb0062edfc12855a51fa972b1ec68ee.jpg?d=identicon"
                    alt="..."
                    className="shadow rounded-full w-8 h-auto border-2"
                />
            </div>
            <div className="">
                <div
                    className="text-xs w-58 text-justify"
                    dangerouslySetInnerHTML={{
                        __html: data.description,
                    }}
                ></div>
                <p className="text-gray-400 text-xs text-right">
                    {moment(data.created_at).fromNow()}
                </p>
            </div>
        </div>
    )
}
export default Notification
