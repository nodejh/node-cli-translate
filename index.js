#!/usr/bin/env node

const chalk = require('chalk');
const commander = require('commander');
const youdao = require('./src/youdao');
const version = require('./version');
const { parse2Int } = require('./utils');

const program = new commander.Command();


program
   .version('0.0.1')
   .description('Command Line Translate')


program
  .command('language')
  .alias('lang')
  .description('Lists available translation languages.')
  .action(function() {
    youdao.listLanguages();
  })

program
  .command('list')
  .description('List words')
  .alias('l')
  .option('-n, --number <number>', 'number of words', parse2Int, 20)
  .option('-p, --page <page>', 'page of words', parse2Int, 1)
  .action(function(options) {
    console.log(chalk.yellow('TODO...'));
  });

program
  .command('trans [word]')
  .alias('t')
  .description('Translate word')
  .option('-t, --target [text]', 'target language', 'auto')
  .action(async function(text, options){
    if (!(text && options)) {
      return program.outputHelp();
    }
    const TRANSLATE_CONFIG = process.env.TRANSLATE_CONFIG;
    if (!TRANSLATE_CONFIG) {
      console.log(chalk.red('Please config translate config file.'));
      return;
    }
    try {
      await youdao.translate(text, options.target);
    } catch (error) {
      console.log(chalk.red(error))
    }
    
  })


program.parse(process.argv);

if (!program.args.length) program.help();


