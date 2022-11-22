import { useState } from "react";
import useSWR from "swr";
import Error from "../errorAndLoading/Error";
import Loading from "../errorAndLoading/Loading";
import fetcher from "../Utils/fetcher";

export default function TwoFactorModal () {

    const {data, error} = useSWR(`/api/users`, fetcher)
    const [ShowModal, setModal]= useState<string>();
    const PassWord = (e:React.ChangeEvent<HTMLInputElement>)=> {setModal(e.target.value.trim())};
  
    if(error) return <Error />
    if(!data) return <Loading />
  
    return (
        <div>
        {
            (<div className = "modal-background">
               <div className="box">
                <div className="title">
                    <h2>2Fa Auth</h2>
                </div>
                <form>
              
                <div className="submitform">
                <label>VERIFICATION PASSWORD  </label> 
                  <input type="text" onChange={PassWord} />
                </div>
              
              </form>  
              </div>
              </div>
          )}    
            <style jsx>{`
           .modal-background {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.8);
          }
          .box{
            position: fixed;
            top: 30%;
            left: 33%;
  
            width: 500px;
            height: 300px;
  
            background-color: white;
            border: 1px inset black;
            box-shadow: 10px 10px;
            text-transform: uppercase;
          }
          .title{
            padding-left: 10px;
            background-color: black;
            color: white;
          }
          input {
            // background-color: tomato;
            font-family: "Fragment Mono", monospace;
            width: 400px;
            height: 30px;
            border-top: none;
            border-left: none;
            border-right: none;
            border-bottom: 2px solid black;
            outline: none;
            margin-bottom: 20px;
          }
          .submitform {
            // background-color: yellow;
            padding-left: 50px;
            padding-top: 20px;
        
  
        `}
        </style>
        </div>
)}
