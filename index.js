const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
const fetch = require('./src/utils/fetch');

dotenv.config();

const feedlyStreamName = process.env.feedlyStreamName;
const feedlyToken = process.env.feedlyToken;
const countOnDay = Number(process.env.countOnDay);
const todoistToken = process.env.todoistToken;
const todoistProjectId = Number(process.env.todoistProjectId);

const run = async () => {
	const articles = await loadArticlesFromFeedly();
	await addArticlesToTodoist(articles);
	await markAsUnsavedInFeedly(articles);
}

const loadArticlesFromFeedly = async () => {
	const url = `https://cloud.feedly.com/v3/streams/${feedlyStreamName}/contents?count=${7 * countOnDay}`
	const data = await fetch(url).get({
		headers: {
			"Authorization": `OAuth ${feedlyToken}`
		}
	});

	return data.data.items.map(item => ({
		id: item['id'],
		url: item['originId'],
		title: item['title'],
	}));
}

const addArticlesToTodoist = async (articles) => {
	const realCountOnDay = Math.min(Math.ceil(articles.length / 7), countOnDay);
	for (let i = 0; i < Math.min(7 * realCountOnDay, articles.length); i++) {
		articles[i].date = getDate(i / realCountOnDay);
		await addToTodoist(articles[i]);
	}
}

const getDate = (addDay) => {
	const day = Math.floor(addDay);
	const date = new Date();
	date.setDate(date.getDate() + day);
	return date.toISOString().substring(0, 10);
}

const addToTodoist = async article => {
	await fetch("https://api.todoist.com/rest/v1/tasks").post({
		headers: {
			"Content-Type": "application/json",
			"X-Request-Id": uuidv4(),
			"Authorization": `Bearer ${todoistToken}`,
		},
		data: {
			project_id: todoistProjectId,
			due_date: article.date,
			content: `${article.url} (${article.title})`
		}
	});
}

const markAsUnsavedInFeedly = async articles => {
	const ignored = await fetch(`https://cloud.feedly.com/v3/markers`).post({
		data: {
			action: "markAsUnsaved",
			type: "entries",
			entryIds: articles.map(item => item.id),
		},
		headers: {
			"Authorization": `OAuth ${feedlyToken}`
		}
	});
}

// Main
run()
	.then(() => { })
	.catch(t => {
		throw t;
	});