#! /usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const inquirer_1 = __importDefault(require("inquirer"));
const node_banner_1 = __importDefault(require("node-banner"));
const questionbank_js_1 = require("./data/questionbank.js");
const Database_js_1 = require("./data/Database.js");
const chalk_1 = __importDefault(require("chalk"));
function studentMenu() {
    return __awaiter(this, void 0, void 0, function* () {
        const studentMenuResp = yield inquirer_1.default.prompt(questionbank_js_1.inquirer_question.studentMenu);
        const students = Database_js_1.students_db.map((std) => std.name + "(" + std.rollNo + ")");
        const courses = Database_js_1.courses_db.map((course) => course.name);
        switch (studentMenuResp.studentMenuItem) {
            case 'Add new student':
                const finalCourseQuestionAddStu = Object.assign(Object.assign({}, questionbank_js_1.inquirer_question.addStudentQuestion[2]), { choices: courses });
                const addStudentResp = yield inquirer_1.default.prompt([questionbank_js_1.inquirer_question.addStudentQuestion[0], questionbank_js_1.inquirer_question.addStudentQuestion[1], finalCourseQuestionAddStu]);
                const course = Database_js_1.courses_db.find(cor => cor.name == addStudentResp.link_Course_Name);
                const new_student = {
                    name: addStudentResp.student_Name,
                    rollNo: addStudentResp.Roll_No,
                    courseId: course.id,
                };
                Database_js_1.students_db.push(new_student);
                console.log(chalk_1.default.green(`Successfully registered ${addStudentResp.student_Name} with Roll No ${addStudentResp.Roll_No} in the course ${addStudentResp.link_Course_Name}`));
                yield studentMenu();
                break;
            case 'Edit student':
                var editMenu = Object.assign(Object.assign({}, questionbank_js_1.inquirer_question.studentEditMenu[0]), { choices: students });
                const ans = yield inquirer_1.default.prompt([editMenu]);
                const selected_student = Database_js_1.students_db.find(stu => stu.name + "(" + stu.rollNo + ")" === ans.student_edit);
                const finalCourseQuestion = Object.assign(Object.assign({}, questionbank_js_1.inquirer_question.sixthquestion[1]), { choices: courses });
                const resp = yield inquirer_1.default.prompt([questionbank_js_1.inquirer_question.sixthquestion[0], finalCourseQuestion]);
                const studentNewCourse = Database_js_1.courses_db.find(course => course.name === resp.new_link_Course_Name);
                const finalStudent = Object.assign(Object.assign({}, selected_student), { name: resp.new_student_Name, courseId: studentNewCourse.id });
                const oldIndex = Database_js_1.students_db.findIndex(stu => stu.rollNo === (selected_student === null || selected_student === void 0 ? void 0 : selected_student.rollNo));
                Database_js_1.students_db[oldIndex] = finalStudent;
                console.log(chalk_1.default.green('Student information has been updated.'));
                yield studentMenu();
                break;
            case 'Delete student':
                var deleteMenu = Object.assign(Object.assign({}, questionbank_js_1.inquirer_question.seventhquestion[0]), { choices: students });
                const deleteAns = yield inquirer_1.default.prompt([deleteMenu]);
                const selectedStudentIndex = Database_js_1.students_db.findIndex(stu => stu.name + "(" + stu.rollNo + ")" === deleteAns.student_delete);
                const deletedstu = Database_js_1.students_db.splice(selectedStudentIndex, 1);
                console.log(chalk_1.default.red(`${deletedstu[0].name} has been deleted as a student.`));
                yield studentMenu();
                break;
            case 'View all students':
                console.log(chalk_1.default.blue('List of Students:'));
                const finalres = Database_js_1.students_db.map(std => {
                    const course = Database_js_1.courses_db.find(cour => cour.id === std.courseId);
                    return Object.assign(Object.assign({}, std), { courseName: course === null || course === void 0 ? void 0 : course.name });
                });
                console.table(finalres);
                yield studentMenu();
                break;
            case 'Exit':
                console.log(chalk_1.default.green('Goodbye...'));
                break;
        }
    });
}
function mainMenu() {
    return __awaiter(this, void 0, void 0, function* () {
        const resp = yield inquirer_1.default.prompt(questionbank_js_1.inquirer_question.firstquestion);
        if (resp.mainpage === 'Courses information') {
            console.table(Database_js_1.courses_db);
            const mQAns = yield inquirer_1.default.prompt(questionbank_js_1.inquirer_question.mainMenuQuestion);
            yield mainMenu();
        }
        else if (resp.mainpage === 'Students information') {
            yield studentMenu();
        }
        else if (resp.mainpage === 'Exit') {
            console.log(chalk_1.default.green('Goodbye...'));
        }
    });
}
await (0, node_banner_1.default)('LMS', 'Welcome to Learning Managment System', 'red', 'blue');
await mainMenu();
