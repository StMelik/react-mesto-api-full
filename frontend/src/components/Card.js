import { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card(props) {
    const { card, onCardClick, onCardLike, onCardDelete } = props
    const currentUser = useContext(CurrentUserContext)
    const isOwn = card.owner._id === currentUser._id;
    const isLiked = card.likes.some(i => i._id === currentUser._id)

    const cardDeleteButtonClassName = (
        `element__delete 
        ${isOwn ?
            'element__delete_visible' :
            'element__delete_hidden'}`
    )

    const cardLikeButtonClassName = (
        `element__heart-icon
        ${isLiked ?
            'element__heart-icon_active' :
            ''}`
    );

    function handleClick() {
        onCardClick(card);
    }

    function handleLikeClick() {
        onCardLike(card)
    }

    function handleDeleteClick() {
        onCardDelete(card)
    }

    return (
        <article className="elements__element element">
            <button
                className={cardDeleteButtonClassName}
                type="button"
                aria-label="Удалить"
                onClick={handleDeleteClick}
            ></button>
            <img
                className="element__image"
                src={card.link}
                alt={card.name}
                onClick={handleClick}
            />
            <div className="element__bottom">
                <h2 className="element__title">{card.name}</h2>
                <div className="element__heart-box">
                    <button
                        className={cardLikeButtonClassName}
                        type="button"
                        aria-label="Понравилось"
                        onClick={handleLikeClick}
                    ></button>
                    <p className="element__heart-value">{card.likes.length}</p>
                </div>
            </div>
        </article>
    )
}

export default Card