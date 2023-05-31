const fs = require('fs')
const { parse } = require('csv-parse')
const NaiveBayes = require('./NaiveBayes')
const cors = require('cors')

const express = require('express')
const app = express()

app.use(express.json())
app.use(cors())


app.post('/classify', (req, res) => {
    const { review } = req.body
    const labels = []
    const trainingData = []

    const cleanAndSplit = require('./helpers')

    fs.createReadStream('./datasets/Test.csv')
        .pipe(parse({ delimiter: ',', from_line: 2 }))
        .on('data', (data) => {
            labels.push(data[1])
            const text = data[0]

            const splitted = cleanAndSplit(text)

            trainingData.push(splitted)
            // console.log(splitted);
            // console.log(labels);
        })
        .on('end', () => {
            // Tworzenie i trenowanie klasyfikatora NaiveBayes
            const classifier = new NaiveBayes();
            classifier.train(trainingData, labels);

            // const input = cleanAndSplit("This movie sucks! Plain and simple. The plot is thin and the idea of a midget in a duck suit is just not plausible. And that oh-so 80's music in this movie is just dreadful. Howard ranks up there with Alf for the most annoying alien. (Ironically, they were both released in 1986.)")

            const input = cleanAndSplit(review)
            const predictedClass = classifier.predict(input);
            res.status(200).json({ classification: predictedClass })
        })
})


app.listen(3000, () => console.log('App running on port 3000'))
