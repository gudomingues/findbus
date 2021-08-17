import React, { Component, useState } from "react";
import axios from "axios";
import "./index.css";
import api from "./Auth/api";

api.post();

export default function Search(props) {
    const URL = "https://aiko-olhovivo-proxy.aikodigital.io/";
    const [resultadoPesquisa, setResultadoPesquisa] = useState([]);
    const [pesquisa, setPesquisa] = useState("");

    const verifySeach = function (e) {
        if (e.length == 0) {
            
        } else {
            return gerarCards();
        }
    }
    const gerarCards = function (e) {
        let cards = [];
        cards = resultadoPesquisa.map(function (el) {
            return (
                <div >
                    <div onClick={() =>{props.setMap(el.py, el.px, el.np)}} className="card border-secondary mb-3">
                        <div>
                            <p>Endereço da parada: {el.ed}</p>
                        </div>
                    </div>
                </div>
            );
        })
        return cards;
    }
    return (
        <div >
            <div className="seach-input ">
                <label >
                    <div>
                        <div className="input-group rounded">
                            <input onChange={(e) => {
                                setPesquisa(e.target.value);
                                axios.get(`${URL}/Parada/Buscar?termosBusca=${e.target.value}`).then((resp) => {
                                    setResultadoPesquisa(resp.data);
                                });
                            }}
                                value={pesquisa} type="search" className="form-control rounded" placeholder="Pesquisar ..." aria-label="Search"
                                aria-describedby="search-addon" />
                            <span className="input-group-text border-0" id="search-addon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                                </svg>
                            </span>
                        </div>
                    </div>

                </label>
            </div>
            <div className="container-ixib">
                <div className="exibir" >
                    {verifySeach(pesquisa)}
                </div>
            </div>
        </div>
    );
    
}
