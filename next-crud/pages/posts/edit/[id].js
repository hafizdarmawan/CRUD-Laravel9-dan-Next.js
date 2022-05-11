// import hook useState
import { useState } from "react";

// import router
import Router from "next/router";

// import layout 
import Layout from "../../../components/layout";

// import axios
import axios from "axios";

// fetch with "getServerSideProps"
export async function getServerSideProps({ params }) {
    // http request
    const req = await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/posts/${params.id}`)
    const res = await req.data.data

    return {
        props: {
            post:res
        },
    }
}


function PostEdit(props) {
    // destruct
    const { post } = props;
    // state 
    const [image, setImage] = useState("");
    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content);

    // state valiation
    const [validation, setValidation] = useState({});

    // function "handleFileChange"
    const handleFileChange = (e) => {
        // define varable for get vlue image data
        const imageData = e.target.files[0];

        // chaeck validation
        if (!imageData.type.match('image.*')) {
            // set state "image" to null
            setImage("");
            return
        }

        // assign file to state image
        setImage(imageData);
    }

    // method "UpdatePpost"
    const updatePost = async (e) => {
        e.preventDefault();

        // define formData
        const formData = new formData();

        // append data to "formData"
        formData.append('image', image);
        formData.append('title', title);
        formData.append('content', content);
        formData.append('_method', 'PUT');

        // send data to server
        await axios.post(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/posts/${post.id}`, formData)
            .then(() => {

                // redirect
                Router.push('/posts')
            })
            .catch((error) => {
                // assign validation on state
                setValidation(error.response.data);
            })
    };

    return (
        <Layout>
            <div className="container" style={{ marginTop: '80px' }}>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card border-0 rounded shadow-sm">
                            <div className="card-body">
                                <form onSubmit={updatePost}>
                                    <div className="form-group mb-3">
                                        <label className="form-label fw-bold">Image</label>
                                        <input type="file" className="form-control" onChange={handleFileChange} />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="form-label fw-bold">Title</label>
                                        <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Masukan Title" />
                                    </div>
                                    {validation.title &&
                                        <div className="alert alert-danger">
                                            {validation.title}
                                        </div>
                                    }

                                    <div className="form-group mb-3">
                                        <label className="form-group fw-bold">Content</label>
                                        <textarea rows={3} className="form-group" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Masukan Content" />
                                    </div>
                                    {
                                        validation.content &&
                                        <div className="alert alert-danger">
                                            {validation.content}
                                        </div>
                                    }
                                    <button className="btn btn-primary border-0 shadow" type="submit">Update</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
export default PostEdit