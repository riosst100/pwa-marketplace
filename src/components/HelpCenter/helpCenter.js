import React, { useMemo, useCallback, useState } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import useHelpCenter from '@riosst100/pwa-marketplace/src/talons/HelpCenter/useHelpCenter';
import classes from './helpcenter.module.css';

const HelpCenter = () => {
	const { loading, error, data } = useHelpCenter();
	const history = useHistory();
	const location = useLocation();

	const queryParams = new URLSearchParams(location.search);
	const activeTag = queryParams.get('tag') || '';

	const tagCounts = useMemo(() => {
		const counts = {};
		(data.questions || []).forEach(q => {
			const tags = Array.isArray(q.tags) ? q.tags : (typeof q.tags === 'string' ? q.tags.split(',') : []);
			tags.map(t => t && t.trim()).filter(Boolean).forEach(t => {
				counts[t] = (counts[t] || 0) + 1;
			});
		});
		return counts;
	}, [data.questions]);

	const [expandedId, setExpandedId] = useState(null);
	const toggleExpanded = useCallback((id) => {
		setExpandedId(prev => prev === id ? null : id);
	}, []);

	const getExcerpt = useCallback((html, limit = 420) => {
		if (!html) return { text: '', truncated: false };
		const text = html
			.replace(/<style[\s\S]*?<\/style>/gi, ' ')
			.replace(/<script[\s\S]*?<\/script>/gi, ' ')
			.replace(/<[^>]+>/g, ' ')
			.replace(/&nbsp;/g, ' ')
			.replace(/\s+/g, ' ')
			.trim();
		if (text.length <= limit) return { text, truncated: false };
		const cut = text.slice(0, limit);
		const lastSpace = cut.lastIndexOf(' ');
		const snippet = (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trim() + '...';
		return { text: snippet, truncated: true };
	}, []);

	const visibleQuestions = useMemo(() => {
		const qs = data.questions || [];
		if (!activeTag) return qs;
		return qs.filter(q => {
			const tags = Array.isArray(q.tags) ? q.tags : (typeof q.tags === 'string' ? q.tags.split(',') : []);
			return tags.map(t => t && t.trim()).includes(activeTag);
		});
	}, [data.questions, activeTag]);

	const onSelectTag = useCallback(tag => {
		const params = new URLSearchParams(location.search);
		if (tag) {
			params.set('tag', tag);
		} else {
			params.delete('tag');
		}
		history.push({ pathname: location.pathname, search: params.toString() });
	}, [history, location]);

	if (loading) {
		return <div>Loading Help Center…</div>;
	}

	if (error) {
		return <div>We\'re sorry, an error has occurred while generating this content.</div>;
	}

	return (
		<div className={classes.container}>
			<h1 className={classes.title}>User Help Center</h1>
			<div className={classes.grid}>
			<aside className={classes.sidebar}>
				<div className={classes.sidebarHeader}>TAGS</div>
				<div className={classes.tagsWrap}>
					{Object.keys(tagCounts).length === 0 && (
						<span className={classes.emptyState}>No tags</span>
					)}
					{Object.entries(tagCounts).map(([tag, count]) => (
						<button
							key={tag}
							onClick={() => onSelectTag(tag)}
							className={`${classes.tagButton} ${activeTag === tag ? classes.tagButtonActive : ''}`}
						>
							{tag.toUpperCase()} ({count})
						</button>
					))}
				</div>
			</aside>
			<main className={classes.main}>
				{activeTag && (
					<h2 className={classes.tagTitle}>Tag : {activeTag}</h2>
				)}
				{visibleQuestions.map(q => {
					const isOpen = expandedId === q.question_id;
					return (
						<article key={q.question_id} className={classes.questionCard}>
							<header
								onClick={() => toggleExpanded(q.question_id)}
								className={`${classes.questionHeader} ${isOpen ? classes.questionHeaderOpen : ''}`}
							>
								<span className={classes.plusIcon}>{isOpen ? '−' : '+'}</span>
								{q.title}
							</header>
							{isOpen && (
								<section className={classes.questionBody}>
									{q.answer ? (
										(() => {
											const { text, truncated } = getExcerpt(q.answer);
											return (
												<>
													<p className={classes.excerpt}>{text} {truncated && (
														<Link to={`/help-center/question/${q.question_id}`} className={classes.tagLink}>Read more</Link>
													)}</p>
												</>
											);
										})()
									) : (
										<div>We\'re sorry, an error has occurred while generating this content.</div>
									)}
									<div className={classes.published}>
										<small>
											{q.update_time ? `on ${new Date(q.update_time).toLocaleDateString()} ` : ''}
											Published in: {Array.isArray(q.tags) ? (
												q.tags.map((t, idx) => (
													<Link key={idx} to={`/help-center?tag=${encodeURIComponent(t)}`} className={classes.tagLink}>{t}{idx < q.tags.length - 1 ? ', ' : ''}</Link>
												))
											) : (
												<Link to={`/help-center?tag=${encodeURIComponent(q.tags)}`} className={classes.tagLink}>{q.tags}</Link>
											)}
										</small>
									</div>
								</section>
							)}
						</article>
					);
				})}
				{visibleQuestions.length === 0 && (
					<div className={classes.emptyState}>No questions found.</div>
				)}
			</main>
			</div>
		</div>
	);
};

export default HelpCenter;
