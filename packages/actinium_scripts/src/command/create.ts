import { prompt } from "enquirer"
import fs from 'fs'

const template_path = `${__dirname}/../../templates`;
const cwd = process.cwd();

export default async function Create() {


    let template_paths = fs.readdirSync(template_path);
    let choices: Map<string, string> = new Map<string, string>();
    let choice_list: string[] = []
    template_paths.map((v) => {
        let name = v.replace("-", " ").split(" ").map((v) => {
            v = v.charAt(0).toUpperCase() + v.slice(1)
            return v
        }).join(" + ")
        choice_list.push(name)
        choices.set(name, template_path + "/" + v)
    })

    const resp: { name: string, 'project-choice': string } = await prompt([
        {
            name: 'name',
            type: 'input',
            message: 'Project name:',
            validate: function (input) {
                if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
                else return 'Project name may only include letters, numbers, underscores and hashes.';
            }
        },
        {
            name: 'project-choice',
            type: 'select',
            message: 'What project template would you like to generate?',
            choices: choice_list
        }
    ])

    fs.mkdirSync(`${cwd}/${resp['name']}`);
    let path = choices.get(resp['project-choice'])
    if (path === undefined || null) { return }

    createDirectoryContents(path, resp['name'])
}


function createDirectoryContents(templatePath: string, newProjectPath: string) {
    const filesToCreate = fs.readdirSync(templatePath);

    filesToCreate.forEach(file => {
        const origFilePath = `${templatePath}/${file}`;

        // get stats about the current file
        const stats = fs.statSync(origFilePath);

        if (stats.isFile()) {
            const contents = fs.readFileSync(origFilePath, 'utf8');

            const writePath = `${cwd}/${newProjectPath}/${file}`;
            fs.writeFileSync(writePath, contents, 'utf8');
        } else if (stats.isDirectory()) {
            fs.mkdirSync(`${cwd}/${newProjectPath}/${file}`);

            createDirectoryContents(`${templatePath}/${file}`, `${newProjectPath}/${file}`);
        }
    });
}