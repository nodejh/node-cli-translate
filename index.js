#!/usr/bin/env node

/* eslint-disable no-console */
const chalk = require('chalk');
const ora = require('ora');
const commander = require('commander');
const commands = require('./src/commands');
const version = require('./version');
const { parse2Int, log } = require('./utils');


const program = new commander.Command();


program
  .version(version)
  .description('Command Line Translate');

program
  .command('init')
  .description('Init table in ALI Cloud table store.')
  .option('-n, --name [name]', 'table name', 'translate_words_youdao')
  .action(async (command) => {
    const timeStart = new Date();
    const tableName = command.name;
    const spinner = ora({
      text: `${chalk.grey('Init table...')} ${chalk.white(tableName)}`,
      spinner: 'hearts',
    }).start();
    log();
    try {
      await commands.init(tableName);
      spinner.succeed(chalk.grey(`${new Date() - timeStart}ms`));
    } catch (error) {
      console.error(chalk.red(error));
      spinner.fail(chalk.red(`${new Date() - timeStart}ms`));
    }
  });


program
  .command('language')
  .alias('lang')
  .description('Lists available translation languages.')
  .action(() => {
    commands.language();
  });


program
  .command('list')
  .description('List words')
  .alias('l')
  .option('-p, --page <page>', 'page of words', parse2Int, 1)
  .option('-n, --number <number>', 'number of words', parse2Int, 20)
  .option('-s, --sort <sort>', 'sort type', /^(updateTimeStamp|count)$/, 'updateTimeStamp')
  .action(async (command) => {
    const timeStart = new Date();
    const spinner = ora({
      text: `${chalk.grey('Listing...')}`,
      spinner: 'hearts',
    }).start();
    log();
    try {
      const { page, number, sort } = command;
      await commands.list(page, number, sort);
      spinner.succeed(chalk.grey(`${new Date() - timeStart}ms`));
      return null;
    } catch (error) {
      console.error(chalk.red(error));
      spinner.fail(chalk.red(`${new Date() - timeStart}ms`));
      return null;
    }
  });

program
  .command('trans [word]')
  .alias('t')
  .description('Translate word')
  .option('-t, --target [text]', 'target language', 'auto')
  .action(async (word, command) => {
    if (!word) {
      return command.help();
    }
    const timeStart = new Date();
    const tableName = command.name;
    const spinner = ora({
      text: `${chalk.grey('Translating...')} ${chalk.white(tableName)}`,
      spinner: 'hearts',
    }).start();
    log();
    try {
      if (word.length > 30) {
        throw new Error('The word is too long.');
      }
      await commands.trans(word, command.target);
      spinner.succeed(chalk.grey(`${new Date() - timeStart}ms`));
      return null;
    } catch (error) {
      console.error(chalk.red(error));
      spinner.fail(chalk.red(`${new Date() - timeStart}ms`));
      return null;
    }
  });


program.parse(process.argv);

if (!program.args.length) program.help();
