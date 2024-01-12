import React from 'react'
import { Link } from 'react-router-dom'
const About: React.FC = () => {
  return (
    <>
     <div className="container-xxl py-5 wow fadeInUp" data-wow-delay="0.1s">
                <div className="container text-center">
                    <div className="row justify-content-center">
                        <div className="col-lg-6">
                            <i className="bi bi-exclamation-triangle display-1 text-primary" />
                            <h1 className="display-1">About</h1>
                            <h1 className="mb-4">Project Details</h1>
                            <p className="mb-4">This project is created using React, Typescript, Bootstrap and IndexedDb</p>
                            <Link className="btn btn-primary py-2 px-2" to='/'>Go Back To Home</Link>
                        </div>
                    </div>
                </div>
            </div>
    </>
  )
}

export default About