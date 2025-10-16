import ReviewList from "../component/common/review-list"
import CommonLayout from "../component/shop/common-layout"

export const ReviewListPage = () => {
    return (
        <CommonLayout parent="home" title="review">
            <ReviewList />
        </CommonLayout>
    )
}