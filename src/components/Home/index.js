import React from 'react';
import {Link} from 'react-router-dom';
import {FaSearch} from 'react-icons/fa';
import './style.css';

function Home() {

    //React.useEffect(() => {
    //    fetch('../../Data/ProductsAPI.json',{
    //        headers : { 
    //            'Content-Type': 'application/json',
    //            'Accept': 'application/json'
    //        }
    //    })
    //    .then(res=>res.json())
    //    .then(data=>console.log(data))
    //},[])

    const [products,setProducts] = React.useState([]);
    const [images,setImages] = React.useState([]);

    const [searchQuery,setSearchQuery] = React.useState('');
    const [searchList,setSearchList] = React.useState([]);

    const [loading,setLoading] = React.useState(true);
    const [hasErr,setHasErr] = React.useState(false);
    const [errMsg,setErrMsg] = React.useState('');

    const fetchData = async () => {
        const urls = ['../../Data/ProductsAPI.json','../../Data/ImagesAPI.json','../../Data/ProductViewsAPI.json'];

        try{
            const result = await Promise.all(urls.map(async url => {
                const resp = await fetch(url,{
                    headers : { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                    }
                });
                return resp.json();
            }));

            setProducts(result[0].products);
            setImages(result[1].images);

            setLoading(false);
            setHasErr(false);
        } catch (err) {
            console.error(err);
            setErrMsg(err.message);
            setLoading(false);
            setHasErr(true);
        }
    }

    React.useEffect(()=>{
        fetchData();
    },[])

    const searchProducts = (e) => {
        let query = e.target.value;
        setSearchQuery(query);

        if(query.length > 0){
            let searchList = products.map(product => product.name.toLowerCase().includes(query.toLocaleLowerCase()) ? product : null);
            setSearchList(searchList);
        }else{
            setSearchList([]);
        }
    }

    return (
        <div className='container'>
            <h1>Product List</h1>
            {
                loading
                ? 'Loading...'
                : hasErr
                    ? <p>{errMsg}</p>
                    : <div className='product-inner'>
                        <div className='search-box'>
                            <input type="text" 
                                placeholder='Enter atleast 3 charecters' 
                                name='search-inp' 
                                className='search-inp' 
                                onChange={searchProducts}></input>
                            <button className='search-button' onClick={searchProducts}><FaSearch /></button>
                        </div>
                        <div className='product-list'>
                            {
                                searchList.length > 0
                                ? searchList.map((product,index) => {
                                    if(product !== null){
                                        return <Link to={`/product/${product.productId}`}
                                                key={product.productId} 
                                                className='list-item' 
                                                style={{backgroundImage: `url(${images[index]?.url})`,
                                                    backgroundSize:'contain',
                                                    backgroundRepeat:'no-repeat',
                                                    backgroundPosition: 'top center'
                                                }}
                                            >
                                                <div className='img'></div>
                                                <div className='item-details'>
                                                    <div className='text-details'>
                                                        <h3>{product.name}</h3>
                                                        <div className='price-tag'>
                                                            <h2><span style={{fontSize:'1rem'}}>Rs.</span>{product.price}</h2>
                                                            <p><del>{product.o_price}</del></p>
                                                        </div>
                                                    </div>
                                                    <div className='quantity'>
                                                        {
                                                            product.quantity > 20
                                                                ? <p style={{color: 'green'}}><b>{product.quantity}</b> items available</p>
                                                                : product.quantity > 10
                                                                    ? <p style={{color: 'orange'}}>Order now, Only<b>{product.quantity}</b> left</p>
                                                                    : <p style={{color: 'red'}}>Only <b>{product.quantity}</b> items left,Hurry up!!</p>
                                                        }
                                                    </div>
                                                </div>
                                            </Link> 
                                    }else{
                                        return ''
                                    }
                                })
                                : products.map((product,index) => 
                                    <Link to={`/product/${product.productId}`}
                                        key={product.productId} 
                                        className='list-item' 
                                        style={{backgroundImage: `url(${images[index]?.url})`,
                                            backgroundSize:'contain',
                                            backgroundRepeat:'no-repeat',
                                            backgroundPosition: 'top center'
                                        }}
                                    >
                                        <div className='img'></div>
                                        <div className='item-details'>
                                            <div className='text-details'>
                                                <h3>{product.name}</h3>
                                                <div className='price-tag'>
                                                    <h2><span style={{fontSize:'1rem'}}>Rs.</span>{product.price}</h2>
                                                    <p><del>{product.o_price}</del></p>
                                                </div>
                                            </div>
                                            <div className='quantity'>
                                                {
                                                    product.quantity > 20
                                                        ? <p style={{color: 'green'}}><b>{product.quantity}</b> items available</p>
                                                        : product.quantity > 10
                                                            ? <p style={{color: 'orange'}}>Order now, Only<b>{product.quantity}</b> left</p>
                                                            : <p style={{color: 'red'}}>Only <b>{product.quantity}</b> items left,Hurry up!!</p>
                                                }
                                            </div>
                                        </div>
                                    </Link>
                                )
                            }
                        </div>
                    </div>
            }
        </div>
    )
}

export default Home