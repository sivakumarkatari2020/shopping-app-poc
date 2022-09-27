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

    const [original,setOriginal] = React.useState([]);
    const [products,setProducts] = React.useState([]);
    const [images,setImages] = React.useState([]);

    const [searchQuery,setSearchQuery] = React.useState('');

    const [sortBy,setSortBy] = React.useState('');

    const [min,setMin] = React.useState();
    const [max,setMax] = React.useState();

    const [filteredProds,setFilteredProds] = React.useState([]);

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
            setOriginal(result[0].products);

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
            let searchList = original.map(product => product.name.toLowerCase().includes(query.toLocaleLowerCase()) ? product : null);
            setProducts(searchList);
        }else{
            setProducts([...original]);
        }
    }

    const handleSort = (val) => {
        console.log(val);
        setSortBy(val);

        if(val === "price"){
            let list = products.filter(product => product !== null);
            let newList = list.sort((a, b) => (a.price > b.price ? 1 : -1));
            setProducts(newList);
            
            let list2 = filteredProds.filter(product => product !== null);
            let newList2 = list2.sort((a, b) => (a.price > b.price ? 1 : -1));
            setFilteredProds(newList2);
        }else if(val === "quant"){
            let list = products.filter(product => product !== null);
            let newList = list.sort((a, b) => (a.quantity > b.quantity ? -1 : 1));
            setProducts(newList);

            let list2 = filteredProds.filter(product => product !== null);
            let newList2 = list2.sort((a, b) => (a.quantity > b.quantity ? -1 : 1));
            setFilteredProds(newList2);
        }else{
            setProducts([...products]);
        }
    }

    const handleRange = () => {
        if(max <= 10000 && min >= 0 && max > 100 && min < 10000){
            let list = products.filter(product => product !== null);
            let newList = list.filter(product => product.price >= min && product.price <= max);
            console.log(newList);
            setFilteredProds(newList);
        }
    }

    const handleMin = (e) => {
        let val = Number(e.target.value);
        setMin(val);
    }

    const handleMax = (e) => {
        let val = Number(e.target.value);
        setMax(val);
    }

    React.useEffect(()=>{
        if(max <= 10000 && min >= 0 && max > 100 && min < 10000){
            let list = products.filter(product => product !== null);
            let newList = list.filter(product => product.price >= min && product.price <= max);
            console.log(newList);
            setFilteredProds(newList);
        }
    },[min,max,products]);

    const handleCateg = (val) => {
        if(val === 'cloth'){
            let list = products.filter(product => product !== null);
            let newList = list.filter(product => product.category === 'cloth');
            setFilteredProds(newList);
        }else if(val === 'jewellery'){
            let list = products.filter(product => product !== null);
            let newList = list.filter(product => product.category === 'jewellery');
            setFilteredProds(newList);
        }else if(val === 'device'){
            let list = products.filter(product => product !== null);
            let newList = list.filter(product => product.category === 'device');
            setFilteredProds(newList);
        }else{
            let list = products.filter(product => product !== null);
            let newList = list.filter(product => product.price >= min && product.price <= max);
            setFilteredProds(newList);
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
                        <div className='wrapper'>
                            <div className='search-box'>
                                <input type="text" 
                                    placeholder='Enter atleast 3 charecters' 
                                    name='search-inp' 
                                    className='search-inp' 
                                    onChange={searchProducts}></input>
                                <button className='search-button' onClick={searchProducts}><FaSearch /></button>
                            </div>
                            <div className='sort-box'>
                                <label>Sort by : </label>
                                <select onChange={(e) => handleSort(e.target.value)}>
                                    <option value='null'><p>None</p></option>
                                    <option value='price'><p>Order by Price</p></option>
                                    <option value='quant'><p>Order by Quantity</p></option>
                                </select>
                            </div>
                        </div>
                        <div className='products-wrapper'>
                            <div className='sidebar'>
                                <h3>Filters</h3>
                                <div className='filter'>
                                    <p>Price Range</p>
                                    <div className='price-holder'>
                                        <input type="number" value={min} onChange={(e) => handleMin(e)} placeholder='Min'></input>
                                        <span>to</span>
                                        <input type="number" value={max} onChange={(e) => handleMax(e)} placeholder='Max'></input>
                                    </div>
                                </div>
                                <div className='filter'>
                                    <p>Category</p>
                                    <div className='categ-holder'>
                                        <div className='checklist'>
                                            <input type='radio' value='all' name='categ' onChange={()=>handleCateg('all')}></input>
                                            <p>All</p>
                                        </div>
                                        <div className='checklist'>
                                            <input type='radio' value='cloth' name='categ' onChange={()=>handleCateg('cloth')}></input>
                                            <p>Clothes</p>
                                        </div>
                                        <div className='checklist'>
                                            <input type='radio' value='jewellery' name='categ' onChange={()=>handleCateg('jewellery')}></input>
                                            <p>Jewellery</p>
                                        </div>
                                        <div className='checklist'>
                                            <input type='radio' value='device' name='categ' onChange={()=>handleCateg('device')}></input>
                                            <p>Devices</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='product-list'>
                                {
                                    filteredProds.length > 0
                                    ? filteredProds.map((product,index) => {
                                        if(product !== null){
                                            return <Link to={`/product/${product.productId}`}
                                                    key={product.productId} 
                                                    className='list-item' 
                                                    style={{backgroundImage: `url(${images[product.imageId-1]?.url})`,
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
                                    : products.map((product,index) => {
                                        if(product !== null){
                                            return <Link to={`/product/${product.productId}`}
                                                    key={product.productId} 
                                                    className='list-item' 
                                                    style={{backgroundImage: `url(${images[product.imageId-1]?.url})`,
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
                                }
                            </div>
                        </div>
                    </div>
            }
        </div>
    )
}

export default Home