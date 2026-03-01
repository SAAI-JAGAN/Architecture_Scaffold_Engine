import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

export function activate(context: vscode.ExtensionContext) {

    const disposable = vscode.commands.registerCommand(
        'backendArchGen.generateGoStructure',
        async () => {

            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders) {
                vscode.window.showErrorMessage("Open a folder first!");
                return;
            }

            const rootPath = workspaceFolders[0].uri.fsPath;

            // 1️⃣ Ask Project Name
            const projectName = await vscode.window.showInputBox({
                prompt: "Enter Project Name (lowercase, no spaces)"
            });

            if (!projectName) {
                vscode.window.showErrorMessage("Project name is required.");
                return;
            }

            // 2️⃣ Ask DB Type
            const dbChoice = await vscode.window.showQuickPick(
                ["SQL", "MongoDB"],
                { placeHolder: "Select Database Type" }
            );

            if (!dbChoice) {
                vscode.window.showErrorMessage("Database type is required.");
                return;
            }

            const dbType = dbChoice === "SQL" ? "sql" : "mongo";

            try {

                // 3️⃣ Create folder structure
                const folders = [
                    "internal/controller",
                    "internal/service",
                    "internal/dao",
                    "internal/model",
                    "internal/middleware",
                    "internal/routes",
                    "internal/helpers",
                    "internal/config"
                ];

                folders.forEach(folder => {
                    fs.mkdirSync(path.join(rootPath, folder), { recursive: true });
                });

                // 4️⃣ Copy base templates
                const templateRoot = path.join(context.extensionPath, "templates");
                const baseTemplatePath = path.join(templateRoot, "base");
                const dbTemplatePath = path.join(templateRoot, dbType);

                copyTemplates(baseTemplatePath, rootPath, projectName, dbType);
                copyTemplates(dbTemplatePath, rootPath, projectName, dbType);

                // 5️⃣ Create go.mod
                const goModContent = `module ${projectName}

go 1.21
`;

                fs.writeFileSync(path.join(rootPath, "go.mod"), goModContent);

                // 6️⃣ Run go mod tidy
                execSync("go mod tidy", { cwd: rootPath, stdio: "inherit" });

                vscode.window.showInformationMessage("🚀 Go Backend Scaffold Generated Successfully!");

            } catch (err: any) {
                vscode.window.showErrorMessage("Error: " + err.message);
            }
        }
    );

    context.subscriptions.push(disposable);
}

function copyTemplates(templateDir: string, destinationRoot: string, projectName: string, dbType: string) {

    const files = getAllFiles(templateDir);

    files.forEach(file => {

        const relativePath = path.relative(templateDir, file)
            .replace(".tpl", "");

        const destinationPath = path.join(destinationRoot, relativePath);

        const dir = path.dirname(destinationPath);
        fs.mkdirSync(dir, { recursive: true });

        let content = fs.readFileSync(file, "utf-8");

        content = content
            .replace(/{{PROJECT_NAME}}/g, projectName)
            .replace(/{{DB_TYPE}}/g, dbType);

        fs.writeFileSync(destinationPath, content);
    });
}

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {

    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        const fullPath = path.join(dirPath, file);

        if (fs.statSync(fullPath).isDirectory()) {
            getAllFiles(fullPath, arrayOfFiles);
        } else {
            arrayOfFiles.push(fullPath);
        }
    });

    return arrayOfFiles;
}

export function deactivate() {}