import React,{useState,useEffect} from "react";
import "./DescriptionBox.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const DescriptionBox = ({productId}) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/reviews/${productId}`); // Use product ID prop
        const fetchedReviews = await response.json();
        setReviews(fetchedReviews);
      } catch (error) {
        console.log(reviews)
        console.error(error);
      }
    };

    fetchReviews(); // Call on component mount or update
  }, [productId]); 

  return (
    <div className="descriptionbox">
    <div className="descriptionbox-navigator">
      <div className="descriptionbox-nav-box fade">Reviews ({reviews.length})</div>
    </div>
    <div className="descriptionbox-description">
      {reviews.length > 0 && (
        <ul style={{display:"block"}} className="review-list">
          {reviews.map((review) => (
            <li key={review.id || review._id} className="review-item">
              <div className="star-rating">
                {[...Array(review.rating)].map((star, index) => (
                  <FontAwesomeIcon icon={faStar} key={index} className="star-icon" />
                ))}
              </div>
              <p className="review-content">{review.review}</p>
            </li>
            
          ))}
        </ul>
      )}
    </div>
  </div>

    );
};

export default DescriptionBox;
