class NaiveBayes {
    constructor() {
        this.classes = {};
        this.classProbabilities = {};
        this.wordCounts = {};
        this.vocabulary = new Set();
    }

    train(trainingData, trainingLabels) {
        const totalSamples = trainingLabels.length;
        const uniqueClasses = new Set(trainingLabels);

        // Obliczanie prawdopodobieństwa wystąpienia każdej klasy
        uniqueClasses.forEach((classLabel) => {
            const classSamples = trainingLabels.filter((label) => label === classLabel);
            const classProbability = classSamples.length / totalSamples;
            this.classes[classLabel] = classSamples.length;
            this.classProbabilities[classLabel] = classProbability;
        });

        // Przetwarzanie danych treningowych
        for (let i = 0; i < trainingData.length; i++) {
            const features = trainingData[i];
            const label = trainingLabels[i];

            if (!this.wordCounts[label]) {
                this.wordCounts[label] = {};
            }

            // Zliczanie słów
            features.forEach((word) => {
                this.vocabulary.add(word);

                if (!this.wordCounts[label][word]) {
                    this.wordCounts[label][word] = 0;
                }

                this.wordCounts[label][word]++;
            });
        }
    }

    predict(features) {
        let bestClass = null;
        let bestScore = -Infinity;


        Object.keys(this.classes).forEach((classLabel) => {
            const classProbability = this.classProbabilities[classLabel];
            const classCount = this.classes[classLabel];
            let score = Math.log(classProbability);


            /*
            Logarytmiczne prawdopodobieństwo XD wystąpienia danego wyrazu
            (pozwala to na sumowanie nie mnożenie i zwieksza dokladnosc algorytmu)
            */
            features.forEach((word) => {
                if (this.vocabulary.has(word)) {
                    const wordCount = this.wordCounts[classLabel][word] || 0;
                    const wordProbability = (wordCount + 1) / (classCount + this.vocabulary.size);
                    score += Math.log(wordProbability);
                }
            });

            /* 
            Sprawdzenie czy dana klasa ma wieksze prawdopodobienstwo logarytmiczne 
            */
            if (score > bestScore) {
                bestScore = score;
                bestClass = classLabel;
            }
        });

        return bestClass;
    }
}

module.exports = NaiveBayes