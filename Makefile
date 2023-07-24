build:
	docker build -t mockingbird .

run:
	docker run -d -p 3000:3000 --name mockingbird --rm mockingbird