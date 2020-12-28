const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
const fetch = require('./src/utils/fetch');

dotenv.config();

const feedlyStreamName = process.env.feedlyStreamName;
const feedlyToken = process.env.feedlyToken;
const countOnDay = Number(process.env.countOnDay);
const todoistToken = process.env.todoistToken;
const todoistProjectId = Number(process.env.todoistProjectId);


console.log(feedlyStreamName);
console.log(feedlyToken);
console.log(countOnDay);
console.log(todoistToken);
console.log(todoistProjectId);


const loadArticles = async () => {
	const data = await fetch(`https://cloud.feedly.com/v3/streams/${feedlyStreamName}/contents?count=${7 * countOnDay}`).get({
		headers: {
			"Authorization": `OAuth ${feedlyToken}`
		}
	});

	return data.data.items.map(item => ({
		id: item.id,
		url: item.originId,
		title: item.title,
	}));
}

const markAsUnsaved = async articles => {
	const data = await fetch(`https://cloud.feedly.com/v3/markers`).post({
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

const addArticles = async (articles) => {
	for (let i = 0; i < Math.min(7 * countOnDay, articles.length); i++) {
		const day = Math.floor(i / countOnDay);
		const date = new Date();
		date.setDate(date.getDate() + day);

		articles[i].date = date.toISOString().substring(0, 10);
		await addToTodoist(articles[i]);
	}
}

const run = async () => {
	//const articles = await loadArticles();
	//await addArticles(articles);
	//await markAsUnsaved(articles);
}

run().then(() => console.log(), e => console.log(e)); 
