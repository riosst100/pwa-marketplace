import React, { useEffect, useMemo } from 'react';
import Collapsible from '@riosst100/pwa-marketplace/src/components/commons/Collapsible';

import useProductFAQ from '@riosst100/pwa-marketplace/src/talons/ProductFAQ/useProductFAQ';

const ProductFAQ = ({ productId }) => {
	const { loadProductFaqList, productFaqListState } = useProductFAQ();

	useEffect(() => {
		if (productId) {
			loadProductFaqList({ productId });
		}
	}, [productId, loadProductFaqList]);

	const { data, loading, error } = productFaqListState || {};
	const items = useMemo(() => {
		const list = data?.productFaqList || [];
		// Show only active items if status provided (1 = active)
		return list.filter(it => it?.status === 1 || it?.status === '1' || it?.status === true || it?.status === 'true' || it?.status === undefined);
	}, [data]);

	if (loading) {
		return <div className="p-4 text-sm text-gray-600">Loading FAQs…</div>;
	}

	if (error) {
		return (
			<div className="p-4 text-sm text-red-600">
				Failed to load FAQs. Please try again.
			</div>
		);
	}

	if (!items.length) {
		return (
			<div className="p-4 text-sm text-gray-600">
				No FAQs available for this product.
			</div>
		);
	}

	return (
		<div className="space-y-2">
			{items.map((faq, idx) => {
				const headerStyle = {
					color: faq?.title_color || undefined,
					background: faq?.title_background || undefined,
					fontSize: faq?.title_size ? `${faq.title_size}px` : undefined,
					borderColor: faq?.border_color || undefined,
					borderWidth: faq?.border_width ? `${faq.border_width}px` : undefined,
					borderRadius: faq?.border_radius ? `${faq.border_radius}px` : undefined,
					marginBottom: faq?.margin_bottom ? `${faq.margin_bottom}px` : undefined,
					marginLeft: faq?.margin_left ? `${faq.margin_left}px` : undefined
				};

				const bodyStyle = {
					color: faq?.body_color || undefined,
					background: faq?.body_background || undefined
				};

				const title = faq?.title || `Question ${idx + 1}`;

				return (
					<Collapsible
						key={`${faq?.question_id || idx}`}
						title={title}
						rootClassName="border-b border-gray-100"
						contentWrapperClassName="!mt-0"
						titleStyle={headerStyle}
					>
						<div style={bodyStyle} className="p-3 text-sm leading-relaxed">
							{faq?.answer || 'No answer provided.'}
						</div>
					</Collapsible>
				);
			})}
		</div>
	);
};

export default ProductFAQ;

