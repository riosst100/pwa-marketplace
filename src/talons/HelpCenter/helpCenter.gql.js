import { gql } from '@apollo/client';

export const FAQ_CATEGORIES = gql`
    query faqCategories {
        faqCategories {
            body_background
            border_color
            border_radius
            border_width
            category_id
            creation_time
            description
            icon
            is_active
            margin_bottom
            margin_left
            meta_description
            meta_keywords
            page_title
            parent_id
            position
            seller_id
            status
            store_id
            title
            title_background
            title_color
            title_size
            update_time
        }
    }
`;

export const FAQ_QUESTIONS = gql`
    query faqQuestions(
        $search: String
        $pageSize: Int
        $currentPage: Int
    ) {
        faqQuestions(search: $search, pageSize: $pageSize, currentPage: $currentPage) {
            items {
                _first_store_id
                animation_class
                animation_speed
                answer
                author_email
                author_name
                body_bg
                body_color
                body_size
                border_width
                creation_time
                disklike
                is_active
                is_featured
                like
                meta_description
                meta_keywords
                page_title
                question_active_icon
                question_icon
                question_id
                question_margin
                question_position
                question_type
                question_url
                store_code
                store_id
                tags
                title
                title_bg
                title_bg_active
                title_border_color
                title_border_radius
                title_color
                title_color_active
                title_size
                update_time
            }
            page_info {
                current_page
                total_pages
            }
            total_count
        }
    }
`;

export const FAQ_TAGS = gql`
    query faqTags {
        faqTags {
            alias
            name
            question_id
            tag_id
        }
    }
`;

export default {
    faqCategoriesQuery: FAQ_CATEGORIES,
    faqQuestionsQuery: FAQ_QUESTIONS,
    faqTagsQuery: FAQ_TAGS
};