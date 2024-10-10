import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
    tableName: 'chat_history',
    modelName: 'ChatHistory',
    timestamps: true
})
class ChatHistory extends Model {
    @Column({
        allowNull: false,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true
    })
    declare id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare username: string;

    @Column({
        type: DataType.STRING
    })
    declare from: string;

    @Column({
        type: DataType.STRING
    })
    declare to: string;

    @Column({
        type: DataType.STRING
    })
    declare name: string;

    @Column({
        type: DataType.STRING
    })
    declare message: string;

    @Column({
        type: DataType.BOOLEAN
    })
    declare isAdmin: boolean;

    @Column({
        type: DataType.BOOLEAN
    })
    declare isActive: boolean;

    @Column({
        type: DataType.ENUM('all', 'completed', 'pending')
    })
    declare taskstatus: string;

    @Column({
        type: DataType.DATE
    })
    declare createdAt?: Date;
}

export default ChatHistory;

/*
3) Chat Import via Excel Sheet: Implement a feature that allows users to import chat history from an Excel sheet.
 This should include 
    parsing the Excel file,
     validating the data, and
     integrating it into the chat system,
 ensuring data integrity and proper formatting.

 Must implement Implement basic task filtering (e.g., show all, only completed, only pending tasks). 

 */