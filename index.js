var main = document.getElementById("main")
var users = [];


function renderPosts(){
	fetch('https://jsonplaceholder.typicode.com/posts')
	  .then(response => response.json())
	  .then(data => {
	  	data.forEach(post =>{
	  		new Post(main, post).mount();
	  	})
	  });
}

fetch('https://jsonplaceholder.typicode.com/users')
  .then(response => response.json())
  .then(data => {
   	users = data;
   	renderPosts();
  });



class Component 
{
	constructor(parrentNode)
	{
		this.parrentNode = parrentNode; 
	}
	create(tag, className = null) 
	{
		var node = document.createElement(tag); 
		if (className)
			node.className = className;
		return node;	
	}
	mount() 
	{
		var node = this.render()
		this.parrentNode.appendChild(node); 
	}

}

class Comment extends Component
{
	constructor(parrentNode, comment)
	{
		super(parrentNode) //Вызов конструктора родительского класса
		this.comment = comment;
	}
	getHead()
	{
		var head = this.create("strong");
		head.innerHTML = this.comment.name;
		return head;
	}
	getBody()
	{
		var body = this.create("p")
		body.innerHTML = this.comment.body;
		return body;
	} 
	render()
	{
		var comment = this.create("div", "comment") //функция принимает название тега и имя класса, возвращает dom-элемент. второй параметр не обязателен;
		comment.appendChild(this.getHead());
		comment.appendChild(this.getBody());
		return comment;
	}
}

class Post extends Component 
{
	constructor(parrentNode, post)
	{
		super(parrentNode)
		this.post = post;
	}
	getAuthor() //Имя автора
	{
		var post = this.post;
		return users.filter(user=>{
			if (user.id == post.userId)
				return user;
		})[0].name; 

	}
	getHeader() //Создание заголовка поста
	{
		var header = this.create("div", "post__head");
		var author = this.create("small")
		author.innerHTML = `Author: ${this.getAuthor()}`;
		header.appendChild(author);
		var title = this.create("strong")
		title.innerHTML = `#${this.post.id} ${this.post.title}`;
		header.appendChild(title);
		return header;
	}
	getText() //Создание текста поста
	{
		var postBody = this.create("p", "post__body")
		postBody.innerHTML = `${this.post.body}`
		return postBody;
	}
	loadComments(node)
	{
		fetch(`https://jsonplaceholder.typicode.com/comments?postId=${this.post.id}`)
			.then(response => response.json())
			.then(data =>{
				var counter = this.create("span");
				counter.innerHTML = `Comments ${data.length}:`;
				node.appendChild(counter);
				data.forEach(comment => new Comment(node, comment).mount());
			});
	}
	getComments() //создание блока комментов
	{
		var comments = this.create("div", "post__comments");
		this.loadComments(comments);
		return comments;
	}
	render()
	{
		var post = this.create("div", "post");	
		post.appendChild(this.getHeader());
		post.appendChild(this.getText());
		post.appendChild(this.getComments());

		return post;
	}
}

