import React from 'react';
import {useParams,useNavigate} from 'react-router-dom';
import {Bar} from 'react-chartjs-2';
import {BsArrowLeft} from 'react-icons/bs';
import './style.css';

import {
    Chart,
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip,
    SubTitle
} from 'chart.js';

Chart.register(
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip,
    SubTitle
);

function ProductDetails() {

    const params = useParams();
    const navigate = useNavigate();

    const [product,setProduct] = React.useState([]);
    const [image,setImage] = React.useState([]);
    const [views,setViews] = React.useState([]);

    const [loading,setLoading] = React.useState(true);
    const [hasErr,setHasErr] = React.useState(false);
    const [errMsg,setErrMsg] = React.useState('');

    const fetchData = async (index) => {

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

            setProduct(result[0].products[index-1]);
            setImage(result[1].images[index-1]);
            setViews(result[2].views[index-1]);

            console.log(product,image,views);

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
        fetchData(params.id);
    },[params.id])

    const state = {
        labels: ['Monday', 'Tuesday', 'Wednesday',
                'Thursday', 'Friday','Saturday','Sunday'],
        datasets: [
            {
                label: 'Views per day',
                data: [views?.views_1,
                        views?.views_2,
                        views?.views_3,
                        views?.views_4,
                        views?.views_5,
                        views?.views_6,
                        views?.views_7
                    ],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                    'rgb(201, 203, 207)'
                ],
                borderWidth: 1
            }
        ]
    }
    
    return (
        <div className='container'>
            <div className='heading'>
                <BsArrowLeft className='icon' onClick={() => {navigate(-1)}}/>
                <h1>Product Details</h1>
            </div>
            {
                loading
                ? 'Loading...'
                : hasErr
                    ? <p>{errMsg}</p>
                    : <div className='product-fullwidth'>
                        <div className='upper-part'>
                            <div className='fullwidth-image'>
                                <img src={image.url} alt="product pic"/>
                            </div>
                            <div className='fullwidth-details'>
                                <h1>{product.name}</h1>
                                <p className='product-desc'>{product.desc}</p>
                                <div className='price-tag'>
                                    <h1><span style={{fontSize:'1rem'}}>Rs.</span>{product.price}</h1>
                                    <p><del>{product.o_price}/-</del></p>
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
                                <div className='button-box'>
                                    <button className='cart-but'>Add to Cart</button>
                                    <button className='order-but'>Order now!!</button>
                                </div>
                            </div>
                        </div>
                        <div className='bottom-part'>
                            <h2 style={{fontSize:'1.7rem'}}>Product Views <p style={{fontSize:'1rem',fontWeight:'normal',color:'rgba(0,0,0,0.5)'}}>since last 1 week</p></h2>
                            <div className='bar-graph'>
                                <Bar
                                    data={state}
                                    options={{
                                        title:{
                                            display:true,
                                            text:'Average Rainfall per month',
                                            fontSize:20
                                        },
                                        legend:{
                                            display:true,
                                            position:'right'
                                        }
                                    }}
                                    className='graph'
                                />
                            </div>
                        </div>
                    </div>
            }
        </div>
    )
}

export default ProductDetails