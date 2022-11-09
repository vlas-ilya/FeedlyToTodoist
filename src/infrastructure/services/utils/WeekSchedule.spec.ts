import { WeekSchedule } from './WeekSchedule';
import { Article } from '../../../infrastructure-interfaces/network/entities/Article';
import { Link } from '../../../domain/user/vo/Link';

const article = (id: string, url: string, title: string): Article =>{
  return {
    id, url, title
  }
}

export async function weekScheduleSpec() {
  const links = [
    new Link("https://link1.ru", new Date(), "1"),
    new Link("https://link2.ru", new Date(), "1"),
    new Link("https://link3.ru", new Date(), "1"),
    new Link("https://link4.ru", new Date(), "1"),
    new Link("https://link5.ru", new Date(), "2"),
    new Link("https://link6.ru", new Date(), "2"),
    new Link("https://link7.ru", new Date(), "3"),
    new Link("https://link8.ru", new Date(), "4"),
    new Link("https://link9.ru", new Date(), "5"),
    new Link("https://link10.ru", new Date(), "6"),
    new Link("https://link11.ru", new Date(), "6"),
    new Link("https://link12.ru", new Date(), "6"),
    new Link("https://link13.ru", new Date(), "6"),
    new Link("https://link14.ru", new Date(), "6"),
    new Link("https://link15.ru", new Date(), "6"),
    new Link("https://link16.ru", new Date(), "6"),
    new Link("https://link17.ru", new Date(), "6"),
  ] as Link[];
  const linkToArticles = [
    article("1", "https://link1.ru", "link1"),
    article("2", "https://link2.ru", "link2"),
    article("3", "https://link3.ru", "link3"),
    article("4", "https://link4.ru", "link4"),
    article("5", "https://link5.ru", "link5"),
    article("6", "https://link6.ru", "link6"),
    article("7", "https://link7.ru", "link7"),
    article("8", "https://link8.ru", "link8"),
    article("9", "https://link9.ru", "link9"),
    article("11", "https://link10.ru", "link10"),
    article("12", "https://link11.ru", "link11"),
    article("13", "https://link12.ru", "link12"),
    article("14", "https://link13.ru", "link13"),
    article("15", "https://link14.ru", "link14"),
    article("16", "https://link15.ru", "link15"),
    article("17", "https://link16.ru", "link16"),
    article("18", "https://link17.ru", "link17"),
  ] as Article[];
  const articles = [
    article("19", "https://article1.ru", "article1.ru"),
    article("20", "https://article2.ru", "article2.ru"),
    article("21", "https://article3.ru", "article3.ru"),
    article("22", "https://article4.ru", "article4.ru"),
    article("23", "https://article5.ru", "article5.ru"),
    article("24", "https://article6.ru", "article6.ru"),
    article("25", "https://article7.ru", "article7.ru"),
    article("26", "https://article8.ru", "article8.ru"),
    article("27", "https://article9.ru", "article9.ru"),
    article("28", "https://article10.ru", "article10.ru"),
    article("29", "https://article11.ru", "article11.ru"),
    article("30", "https://article12.ru", "article12.ru"),
    article("31", "https://article13.ru", "article13.ru"),
    article("32", "https://article14.ru", "article14.ru"),
  ] as Article[];

  const weekSchedule = new WeekSchedule(7, async (link) => linkToArticles[links.indexOf(link)]);
  await weekSchedule.addLinks(links);
  const freeSlots = weekSchedule.freeSlots();
  const articlesForAdd = articles.slice(0, freeSlots);
  await weekSchedule.addArticles(articlesForAdd);
  const addedLinks = weekSchedule.addedLinks();
  const addedArticles = weekSchedule.addedArticles();
  const schedule = weekSchedule.getSchedule();

  console.log(freeSlots);
  console.log(articlesForAdd);
  console.log(addedArticles);
  console.log(addedLinks);
  console.log(schedule)
}
