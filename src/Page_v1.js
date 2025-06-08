import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import DOMPurify from 'dompurify';
const escapeHtml = require('escape-html');

class Page_v1 extends React.Component{
    link_url = "https://www.google.com/"
    page_state=1;

    constructor(props){
        super(props)
        this.state = {
            customInputs: {
                output_text: '',  // ← 出力エリアの初期値
                school: '',
                grade: '',
                gender: '',
                explain_detail: "normal",
                route: '',
                hope: '',
                field: '',
                input_school_name: '',
                input_company_name: '',
                mail_purpose: '',
                custom_field_detail:'',
                custom_school_name: '',
                custom_company_name: '',
                custom_mail_purpose: '',
                copied: false,
                showSpeech: false,
            },
            errors: {
                school: '',
                grade: '',
                gender: '',
                route: ''
            }
        };
        this.handleNextPage = this.handleNextPage.bind(this);
    }

    appConsoleLog  = (value) => {
        if(false){
            console.log(value);
        }else{

        }
    }

    handleCustomInputChange = (e) => {
        const { name, value } = e.target;  // name属性を使う
        const maxLength = 100;
        const safeValue = value.slice(0, maxLength);  // カット

        this.setState(prevState => ({
            customInputs: {
            ...prevState.customInputs,
            [name]: safeValue,
            }
        }));
    };

    validateRequiredInputs = () => {
        const requiredInputKeys = ['school', 'grade', 'gender', "route"];
        const newErrors = {};

        requiredInputKeys.forEach(inputKey => {
            newErrors[inputKey] = this.state.customInputs[inputKey].trim() === '';
        }); 

        this.setState({ errors: newErrors });

        return !Object.values(newErrors).some(error => error);
    };


    getSafetyString(str){
        str = DOMPurify.sanitize(str);
        str = escapeHtml(str);
        return str;
    }

    handleCopy = () => {
        this.appConsoleLog("コピー関数起動")
        navigator.clipboard.writeText(this.state.customInputs.output_text).then(() => {
            this.setState(prevState => ({
                customInputs: {
                ...prevState.customInputs,
                copied: true,
                }
            }));
        }).catch(err => {
            console.error("コピーに失敗しました:", err);
        });
    };

    handleSendGPT = () =>{
        this.appConsoleLog("ChatGPTへ送信");
    }

    // ボタンが押されたときに実行される関数
    handleNextPage() {
        const localCustomInputs = { ...this.state.customInputs };
        for (const key in localCustomInputs) {
            this.appConsoleLog(key,"：",localCustomInputs[key] );
            localCustomInputs[key] = this.getSafetyString(localCustomInputs[key]);
            this.appConsoleLog("safety ", key,"：",localCustomInputs[key] );
        }

        let school_string = "未入力"
        if(localCustomInputs.school==="middle"){
            school_string = "中学校"
        }else if(localCustomInputs.school==="high"){
            school_string = "高校"
        }else if(localCustomInputs.school==="high_tech"){
            school_string = "高専"
        }else if(localCustomInputs.school==="training"){
            school_string = "専門学校"
        }else if(localCustomInputs.school==="college"){
            school_string = "大学"
        }

        let grade_string = "未入力"
        if(localCustomInputs.grade==="g1"){
            grade_string = "1年生"
        }else if(localCustomInputs.grade==="g2"){
            grade_string = "2年生"
        }else if(localCustomInputs.grade==="g3"){
            grade_string = "3年生"
        }else if(localCustomInputs.grade==="g4"){
            grade_string = "4年生"
        }else if(localCustomInputs.grade==="g5"){
            grade_string = "5年生"
        }

        let gender_string = "未入力"
        if(localCustomInputs.gender==="male"){
            gender_string = "男性"
        }else if(localCustomInputs.gender==="female"){
            gender_string = "女性"
        }

        let explain_detail_string = ""
        if(localCustomInputs.explain_detail==="simple"){
            explain_detail_string = "読むのが大変なので、簡単に説明してほしいです。"
        }else if(localCustomInputs.explain_detail==="detailed"){
            explain_detail_string = "文章が長くても良いので、詳しく説明してほしいです。"
        }

        let hope_string = "未入力"
        if(localCustomInputs.hope==="next_school"){
            hope_string = "進学したいと考えています。"
        }else if(localCustomInputs.hope==="get_job"){
            hope_string = "就職したいと考えています。"
        }else if(localCustomInputs.hope==="unknown"){
            hope_string = "進学するか、就職するかはまだ決めていないです。"
        }

        let field_string = ""
        if (localCustomInputs.field === "science") {
            field_string = "理系の分野に進みたくて、";
        } else if (localCustomInputs.field === "arts") {
            field_string = "文系の分野に進みたくて、";
        }else if(localCustomInputs.field==="unknown"){
            field_string = ""
        }else if(localCustomInputs.field==="custom"){
            field_string = localCustomInputs.custom_field_detail + "の分野に進みたくて、"
        }      

        let general_prompt =`あなたは、高校や、大学の進路相談のプロです。
必要に応じた適切なフレームワーク思考や、テクニックを用いながら、ユーザーの質問に対応してください。
また、ユーザー便益の最大化のために情報が不足していれば、事前に質問や確認をしてください。
私は、${school_string}の${grade_string}で、${gender_string}です。${explain_detail_string}
`

        let input_school_name_string = ""
        if(localCustomInputs.hope === "next_school" && localCustomInputs.input_school_name === "custom"){
            input_school_name_string = `具体的には、${localCustomInputs.custom_school_name}に行きたいです。
`
        }

        let input_company_name_string = ""
        if(localCustomInputs.hope === "get_job" && localCustomInputs.input_company_name === "custom"){
            input_company_name_string = `具体的には、${localCustomInputs.custom_company_name}に行きたいです。
`
        }

        let mail_purpose_string = ""
        if(localCustomInputs.mail_purpose === "part_time"){
            mail_purpose_string = `アルバイト採用試験の応募のためのメールを書きたいです。
`
        }else if(localCustomInputs.mail_purpose === "intern"){
            mail_purpose_string = `企業にインターンシップの受付をお願いするためのメールを書きたいです。
`
        }else if(localCustomInputs.mail_purpose === "job"){
            mail_purpose_string = `企業に就職試験に応募するためのメールを書きたいです。
`
        }else if(localCustomInputs.mail_purpose === "other"){
            mail_purpose_string = `${localCustomInputs.custom_mail_purpose}のためのメールを書きたいです。
`
        }

        let choiced_prompt = ``
        if(localCustomInputs.route==="what_is_next_route"){
            choiced_prompt=`${field_string}${hope_string}
進路のことを、一緒に考えて欲しいです。
`
        }else if(localCustomInputs.route==="write_choice_reason"){
            choiced_prompt=`${field_string}${hope_string}
${input_school_name_string}${input_company_name_string}志望動機を考えるのを手伝ってほしいです。
`
        }else if(localCustomInputs.route==="write_my_appeal"){
            choiced_prompt=`${field_string}${hope_string}
${input_school_name_string}${input_company_name_string}自己PRを考えるのを手伝ってほしいです。
`
        }else if(localCustomInputs.route==="write_business_mail"){
            choiced_prompt=`${mail_purpose_string}メールの文面を考えるのを手伝ってほしいです。
`
        }else if(localCustomInputs.route==="unknown"){
            choiced_prompt=`${field_string}${hope_string}
何となく、この先のことが不安なので、助けて欲しいです。
`
        }


        let output_prompt = `${general_prompt}${choiced_prompt}`
        const safety_output_prompt = this.getSafetyString(output_prompt);

        this.appConsoleLog(output_prompt)
        this.appConsoleLog(safety_output_prompt)

        // textareaの出力値を更新
        /*
        this.setState({
            output_text: safety_output_prompt,
        }, () => {
            // スクロールして処方箋に移動
            setTimeout(() => {
                const element = document.getElementById("prescription-card");
                element?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        });
        */


        this.setState(prevState => ({
            customInputs: {
            ...prevState.customInputs,
            output_text: safety_output_prompt
            }
        }), ()=>{
            // スクロールして処方箋に移動
            setTimeout(() => {
                const element = document.getElementById("prescription-card");
                element?.scrollIntoView({ behavior: "smooth" });
            }, 200);
        });

        const isValid = this.validateRequiredInputs();

        if (!isValid) {
            // エラーがあった場合の処理
            alert("入力してない項目があるニャ！");
            return;
        }
    }

    render(){
        return <div className="container mt-3">
            <h1 className="text-center responsive-heading1">ミライエ・ユメミルクリニック</h1>
            <h1 className="text-center responsive-heading2">進学・就職科</h1>
            <br/>

            <form>
                <fieldset className="card">
                    <div className="card-header card-head-yellow">
                        <legend className="card-title">相談したいこと</legend>
                    </div>
                    <div className="card-body">
                        {this.state.errors.route && <p style={{ color: 'red' }}>※ 入力して欲しいニャ</p>}
                        <label>
                            <input className="card-text" type="radio" name="route" value="what_is_next_route" checked={this.state.customInputs.route === "what_is_next_route"} onChange={this.handleCustomInputChange} />
                            全体的に、進路のことを相談したい
                        </label><br />
                        <label>
                            <input type="radio" name="route" value="write_choice_reason" checked={this.state.customInputs.route === "write_choice_reason"} onChange={this.handleCustomInputChange} />
                            志望動機に何を書けば良いか、相談したい
                        </label><br />
                        <label>
                            <input type="radio" name="route" value="write_my_appeal" checked={this.state.customInputs.route === "write_my_appeal"} onChange={this.handleCustomInputChange} />
                            強みや弱み、自己PRについて相談したい
                        </label><br />
                        <label>
                            <input type="radio" name="route" value="write_business_mail" checked={this.state.customInputs.route === "write_business_mail"} onChange={this.handleCustomInputChange} />
                            ビジネスメールの書き方を相談したい
                        </label><br />
                        <label>
                        <input type="radio" name="route" value="unknown" checked={this.state.customInputs.route === "unknown"} onChange={this.handleCustomInputChange} />
                            まだ決まっていないが、何となく不安
                        </label>
                    </div>
                </fieldset>
                <br />                
                <fieldset className="card is">
                    <div className="card-header card-head-brown">
                        <legend className="card-title">通っている学校について</legend>
                    </div>
                    <div className="card-body">
                        {this.state.errors.school && <p style={{ color: 'red' }}>※ 入力して欲しいニャ</p>}
                        <label>
                            <input className="card-text" type="radio" name="school" value="middle" checked={this.state.customInputs.school === "middle"} onChange={this.handleCustomInputChange} />
                            中学校
                        </label><br />
                        <label>
                            <input className="card-text" type="radio" name="school" value="high" checked={this.state.customInputs.school === "high"} onChange={this.handleCustomInputChange} />
                            高校
                        </label><br />
                        <label>
                            <input className="card-text" type="radio" name="school" value="high_tech" checked={this.state.customInputs.school === "high_tech"} onChange={this.handleCustomInputChange} />
                            高専
                        </label><br />
                        <label>
                            <input className="card-text" type="radio" name="school" value="training" checked={this.state.customInputs.school === "training"} onChange={this.handleCustomInputChange} />
                            専門学校
                        </label><br />
                        <label>
                            <input className="card-text" type="radio" name="school" value="college" checked={this.state.customInputs.school === "college"} onChange={this.handleCustomInputChange} />
                            大学
                        </label>
                    </div>
                </fieldset>
                <br />    
                <fieldset className="card">
                    <div className="card-header card-head-brown">
                        <legend className="card-title">学年について</legend>
                    </div>
                    <div className="card-body">
                        {this.state.errors.grade && <p style={{ color: 'red' }}>※ 入力して欲しいニャ</p>}
                        <label>
                            <input className="card-text" type="radio" name="grade" value="g1" checked={this.state.customInputs.grade === "g1"} onChange={this.handleCustomInputChange} />
                            １年生
                        </label><br />
                        <label>
                            <input className="card-text" type="radio" name="grade" value="g2" checked={this.state.customInputs.grade === "g2"} onChange={this.handleCustomInputChange} />
                            ２年生
                        </label><br />
                        <label>
                            <input className="card-text" type="radio" name="grade" value="g3" checked={this.state.customInputs.grade === "g3"} onChange={this.handleCustomInputChange} />
                            ３年生
                        </label><br />

                        {/* 中学校でない場合のみ表示 */}
                        {(this.state.customInputs.school === "high_tech" || this.state.customInputs.school === "college") && (
                            <>
                            <label>
                                <input className="card-text" type="radio" name="grade" value="g4" checked={this.state.customInputs.grade === "g4"} onChange={this.handleCustomInputChange} />
                                ４年生（大学生、高専生用）
                            </label><br />
                            </>
                        )}
                        {this.state.customInputs.school === "high_tech" && (
                            <>
                            <label>
                                <input className="card-text" type="radio" name="grade" value="g5" checked={this.state.customInputs.grade === "g5"} onChange={this.handleCustomInputChange} />
                                ５年生（高専生用）
                            </label><br />
                            </>
                        )}           
                    </div>
                </fieldset>
                <br/>
                <fieldset className="card">
                    <div className="card-header card-head-brown">
                        <legend className="card-title">性別について</legend>
                    </div>
                    <div className="card-body">
                        {this.state.errors.gender && <p style={{ color: 'red' }}>※ 入力して欲しいニャ</p>}
                        <label>
                            <input className="card-text" type="radio" name="gender" value="male" checked={this.state.customInputs.gender === "male"} onChange={this.handleCustomInputChange} />
                            男性
                        </label><br />
                        <label>
                            <input className="card-text" type="radio" name="gender" value="female" checked={this.state.customInputs.gender === "female"} onChange={this.handleCustomInputChange} />
                            女性
                        </label>
                    </div>
                </fieldset>
                <br />  
                <fieldset className="card">
                    <div className="card-header card-head-brown">
                        <legend className="card-title">説明の詳しさ</legend>
                    </div>
                    <div className="card-body">
                        <label>
                            <input
                            className="card-text" 
                            type="radio"
                            name="explain_detail"
                            value="normal"
                            checked={this.state.customInputs.explain_detail === "normal"}
                            onChange={this.handleCustomInputChange}
                            />
                            普通ぐらいで良い
                        </label><br />
                        <label>
                            <input
                            className="card-text" 
                            type="radio"
                            name="explain_detail"
                            value="simple"
                            checked={this.state.customInputs.explain_detail === "simple"}
                            onChange={this.handleCustomInputChange}
                            />
                            文章短めで、簡単に説明してほしい
                        </label><br />
                        <label>
                            <input
                            className="card-text" 
                            type="radio"
                            name="explain_detail"
                            value="detailed"
                            checked={this.state.customInputs.explain_detail === "detailed"}
                            onChange={this.handleCustomInputChange}
                            />
                            文章が長くても、詳しく説明してほしい
                        </label>          
                    </div>

                </fieldset>
                <br />
                {
                (
                (this.state.customInputs.route === "what_is_next_route") || (this.state.customInputs.route === "write_choice_reason") || (this.state.customInputs.route === "write_my_appeal") || (this.state.customInputs.route === "unknown")
                )&& (
                    <>
                        <fieldset className="card">
                            <div className="card-header card-head-blue">
                                <legend className="card-title">進学、就職、どっちにしたい？</legend>
                            </div>
                            <div className="card-body">
                                <label>
                                    <input type="radio" name="hope" value="next_school" checked={this.state.customInputs.hope === "next_school"} onChange={this.handleCustomInputChange} />
                                    進学したい
                                </label><br />
                                <label>
                                    <input type="radio" name="hope" value="get_job" checked={this.state.customInputs.hope === "get_job"} onChange={this.handleCustomInputChange} />
                                    就職したい
                                </label><br />
                                <label>
                                    <input type="radio" name="hope" value="unknown" checked={this.state.customInputs.hope === "unknown"} onChange={this.handleCustomInputChange} />
                                    まだ決めていない
                                </label>
                            </div>

                        </fieldset>
                        <br />
                    </>
                )}
                {
                (
                (this.state.customInputs.route === "what_is_next_route") || (this.state.customInputs.route === "write_choice_reason")|| (this.state.customInputs.route === "write_my_appeal")
                )&& (
                    <>
                        <fieldset className="card">
                            <div className="card-header card-head-blue">
                                <legend className="card-title">どんな分野に進みたい？</legend>
                            </div>
                            <div className="card-body">
                                <label>
                                    <input
                                    className="card-text" 
                                    type="radio"
                                    name="field"
                                    value="science"
                                    checked={this.state.customInputs.field === "science"}
                                    onChange={this.handleCustomInputChange}
                                    />
                                    理系
                                </label><br />
                                <label>
                                    <input
                                    className="card-text" 
                                    type="radio"
                                    name="field"
                                    value="arts"
                                    checked={this.state.customInputs.field === "arts"}
                                    onChange={this.handleCustomInputChange}
                                    />
                                    文系
                                </label><br />
                                <label>
                                    <input
                                    className="card-text" 
                                    type="radio"
                                    name="field"
                                    value="unknown"
                                    checked={this.state.customInputs.field === "unknown"}
                                    onChange={this.handleCustomInputChange}
                                    />
                                    決めていない
                                </label><br />
                                {/* 具体的な分野 */}
                                <label>
                                    <input
                                    className="card-text" 
                                    type="radio"
                                    name="field"
                                    value="custom"
                                    checked={this.state.customInputs.field === "custom"}
                                    onChange={this.handleCustomInputChange}
                                    />
                                    こんな分野に進みたい
                                </label>
                                <br />

                                {/* 入力フィールド（選択時のみ表示） */}
                                {this.state.customInputs.field === "custom" && (
                                    <input
                                    className="card-text form-control mt-2"
                                    name="custom_field_detail"
                                    type="text"
                                    placeholder="どんな分野か教えてください。例：情報工学、教育、芸術 など"
                                    value={this.state.customInputs.custom_field_detail}
                                    onChange={this.handleCustomInputChange}
                                    />
                                )}
                            </div>


                        </fieldset>
                        <br />
                    </>
                )}                
                {
                ((this.state.customInputs.route === "write_choice_reason")|| (this.state.customInputs.route === "write_my_appeal"))
                && (this.state.customInputs.hope === "next_school")
                 && (
                    <>
                        <fieldset className="card">
                            <div className="card-header card-head-blue">
                                <legend className="card-title">行きたい学校、もう決めてる？</legend>
                            </div>
                            <div className="card-body">
                                {/* これから決める */}
                                <label>
                                    <input
                                    className="card-text"
                                    type="radio"
                                    name="input_school_name"
                                    value="undecided"
                                    checked={this.state.customInputs.input_school_name === "undecided"}
                                    onChange={this.handleCustomInputChange}
                                    />
                                    これから決める
                                </label><br />

                                {/* 入力する */}
                                <label>
                                    <input
                                    className="card-text"
                                    type="radio"
                                    name="input_school_name"
                                    value="custom"
                                    checked={this.state.customInputs.input_school_name === "custom"}
                                    onChange={this.handleCustomInputChange}
                                    />
                                    こんな学校に行きたい
                                </label><br />

                                {/* 学校名入力欄（選ばれたときだけ表示） */}
                                {this.state.customInputs.input_school_name === "custom" && (
                                    <input
                                    type="text"
                                    name="custom_school_name"
                                    className="card-text form-control mt-2"
                                    placeholder="具体的な学校名や、大体のイメージを入力してください"
                                    value={this.state.customInputs.custom_school_name}
                                    onChange={this.handleCustomInputChange}
                                    />
                                )}
                            </div>


                        </fieldset>
                        <br />
                    </>
                )}
                {
                ((this.state.customInputs.route === "write_choice_reason")|| (this.state.customInputs.route === "write_my_appeal"))
                && (this.state.customInputs.hope === "get_job")
                 && (
                    <>
                        <fieldset className="card">
                            <div className="card-header card-head-blue">
                                <legend className="card-title">行きたい会社、もう決めてる？</legend>
                            </div>
                            <div className="card-body">
                                {/* これから決める */}
                                <label>
                                    <input
                                    className="card-text"
                                    type="radio"
                                    name="input_company_name"
                                    value="undecided"
                                    checked={this.state.customInputs.input_company_name === "undecided"}
                                    onChange={this.handleCustomInputChange}
                                    />
                                    これから決める
                                </label><br />

                                {/* 入力する */}
                                <label>
                                    <input
                                    className="card-text"
                                    type="radio"
                                    name="input_company_name"
                                    value="custom"
                                    checked={this.state.customInputs.input_company_name === "custom"}
                                    onChange={this.handleCustomInputChange}
                                    />
                                    こんな会社に行きたい
                                </label><br />

                                {/* 企業名入力欄（選ばれたときだけ表示） */}
                                {this.state.customInputs.input_company_name === "custom" && (
                                    <input
                                    type="text"
                                    name="custom_company_name"
                                    className="card-text form-control mt-2"
                                    placeholder="具体的な会社の名前や、大体のイメージを入力してください"
                                    value={this.state.customInputs.custom_company_name}
                                    onChange={this.handleCustomInputChange}
                                    />
                                )}
                            </div>


                        </fieldset>
                        <br />
                    </>
                )}
                {
                (this.state.customInputs.route === "write_business_mail")
                && (
                    <>
                        <fieldset className="card">
                            <div className="card-header card-head-blue">
                                <legend className="card-title">何のためにメールを書きたい？</legend>
                            </div>
                            <div className="card-body">
                                <label>
                                    <input
                                    className="card-text" 
                                    type="radio"
                                    name="mail_purpose"
                                    value="part_time"
                                    checked={this.state.customInputs.mail_purpose === "part_time"}
                                    onChange={this.handleCustomInputChange}
                                    />
                                    アルバイトの採用試験のため
                                </label><br />

                                <label>
                                    <input
                                    className="card-text" 
                                    type="radio"
                                    name="mail_purpose"
                                    value="intern"
                                    checked={this.state.customInputs.mail_purpose === "intern"}
                                    onChange={this.handleCustomInputChange}
                                    />
                                    インターンシップのお願いのため
                                </label><br />

                                <label>
                                    <input
                                    className="card-text" 
                                    type="radio"
                                    name="mail_purpose"
                                    value="job"
                                    checked={this.state.customInputs.mail_purpose === "job"}
                                    onChange={this.handleCustomInputChange}
                                    />
                                    就職試験を受けるため
                                </label><br />

                                <label>
                                    <input
                                    className="card-text" 
                                    type="radio"
                                    name="mail_purpose"
                                    value="other"
                                    checked={this.state.customInputs.mail_purpose === "other"}
                                    onChange={this.handleCustomInputChange}
                                    />
                                    その他の目的のため
                                </label><br />

                                {this.state.customInputs.mail_purpose === "other" && (
                                    <input
                                    type="text"
                                    name="custom_mail_purpose"
                                    className="card-text form-control mt-2"
                                    placeholder="なんのためにメールを書きたいですか？"
                                    value={this.state.customInputs.custom_mail_purpose}
                                    onChange={this.handleCustomInputChange}
                                    />
                                )}
                            </div>


                        </fieldset>
                        <br />
                    </>
                )}

                {
                    (true)
                    &&(
                        <>
                            <div id="cat-doctor" className="fade-in" >
                                <div className="text-center ">
                                    <div className="position-relative d-inline-block">
                                        <img src="cat_doctor_face.png" alt="説明" style={{ maxWidth: "300px", height: "auto" }} />
                                    </div>
                                    <br/>
                                    <br/>                     
                                    {
                                        (false)
                                        && (
                                            <>
                                                <p
                                                    className="position-absolute"
                                                    style={{ top: '0%', left: '-40%' }}
                                                    >
                                                お任せニャ！
                                                </p>
                                                <svg width="200" height="100">
                                                <path d="M10,10 h180 v60 h-40 l-10,20 l-10,-20 h-120 z" fill="#f9f9f9" stroke="#ccc" />
                                                <text x="100" y="45" textAnchor="middle" dominantBaseline="middle" fontWeight="bold">お任せニャ〜♪</text>
                                                </svg>
                                                <img src="/images/fukidashi.png" alt="説明" style={{ maxWidth: "300px", height: "auto" }} />

                                            </>
                                        )
                                    }
                                    <button type="button" className="btn btn-primary" onClick={this.handleNextPage}>
                                        診察を受ける
                                    </button>
                                </div>

                            </div>
                            <br/>                        
                        </>
                    )
                }


                {
                    (this.state.customInputs.output_text !== "")
                    && (
                        <>
                            <div id="prescription-card" className="fade-in">
                                <fieldset className="card">
                                    <div className="card-header card-head-yellow">
                                        <legend className="card-title">ベンジャミン先生の処方箋</legend>
                                    </div>
                                    <div className="card-body">
                                        {/* ベンジャミン先生の処方箋 */}
                                        <div>
                                            <textarea
                                                name="output_area"
                                                disabled={true}
                                                value={this.state.customInputs.output_text}
                                                className="card-text form-control"
                                                rows={10}
                                            />
                                        </div>

                                        <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3 mt-3">
                                        <a
                                            href={`https://chatgpt.com/?q=${encodeURIComponent(this.state.customInputs.output_text)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                style={{ minWidth: "350px"}} // ← ここで幅固定
                                                onClick={this.handleSendGPT}
                                            >
                                            ここを押したら、ChatGPTで質問始めるニャ
                                            </button>
                                        </a>

                                        <button
                                            type="button"
                                            className={`btn ${this.state.customInputs.copied ? "btn-success" : "btn-primary"}`}
                                            style={{ minWidth: "350px"}} // ← ここで幅固定
                                            onClick={this.handleCopy}
                                        >
                                            {this.state.customInputs.copied ? "文章コピーしたニャ！" : "文章コピーをしたい人はこっち押してニャ"}
                                        </button>
                                        </div>                                        
                                    </div>
                                </fieldset>
                            </div>      
 

                        </>
                    )
                }


          
                <div className="text-end">
                    <p>
                    主催：ながおか・若者・しごと機構<br/>
                    <a href="https://www.instagram.com/wakamonokikou/">インスタグラムはこちら</a><br/>
                    </p>
                </div>
                <div className="text-end">
                    <p>
                    企画：地域おこし協力隊　桑原崚介<br/>
                    <a href="https://www.instagram.com/kuwabara128/">インスタグラムはこちら</a><br/>
                    </p>
                </div>
                </form>
            </div>
    }
}

export default Page_v1;