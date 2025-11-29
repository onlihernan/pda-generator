
const getDraftPercentage = (category) => {
    if (category.includes('30%')) return 0.30;
    if (category.includes('22.5%')) return 0.225;
    if (category.includes('15%')) return 0.15;
    if (category.includes('7.5%')) return 0.075;
    if (category.includes('0%')) return 0;
    return 0;
};

console.log('0%:', getDraftPercentage('Igual o menor a 8.53m (0%)'));
console.log('30%:', getDraftPercentage('Mayor a 10.36m (30%)'));
