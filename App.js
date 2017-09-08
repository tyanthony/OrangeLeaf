import React from 'react';
import { StyleSheet, Text, View, TextInput, 
         Button, Alert, TouchableHighlight, ActivityIndicator,
         ListView, ScrollView, FlatList } from 'react-native';

export default class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      isLoading: false,
      searched: false,
      books: [],
      bookData: []
    }
  }

  _onButtonPress = () => {
    this._getBooks();
  }

  _onBack = () => {
    this.setState({ searched: false });
  }

  _getUrl() {
    return 'https://www.goodreads.com/search/index.xml?key=MpiS3x0Qne6Vr0kYGv0ag&q=' + this.state.searchText;
  }

  _getXML(s) {
    var XMLParser = require('react-xml-parser');
    var test = new XMLParser();
    var xml = new XMLParser().parseFromString(s);
    console.log(xml);
    return xml;
  }

  _getBooks() {
    usedBooks = [];
    return fetch(this._getUrl())
      .then((res) => {
        return res.text();
      })
      .then((resJson) => {
        // remove header of XML
        if (resJson.toLowerCase().substr(0,5) == '<?xml') {
          resJson = resJson.split(/\?>\r{0,1}\n{0,1}/).slice(1).join('?>\n');
        }
        bookTemp = this._getXML(resJson).getElementsByTagName('work');
        
        for (i = 0; i < bookTemp.length; i++) {
          if (bookTemp[i].children.length == 9) {
            usedBooks.push(bookTemp[i]);
          }
        }
        // this.setState({ books: usedBooks });
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        // console.log(this.state.books);

        this.setState({ searched: true });
        this.setState({ books: ds.cloneWithRows(usedBooks) });
        console.log(this.state.books);
      })
      .catch((error) => {
        console.error(error); 
      });
  }

  render() {
    if (this.state.isLoading) { 
      return (
        <View style={{flex: 1, paddingTop: 20}}>
          <ActivityIndicator />
        </View>
      );
    }
    else {
      if (this.state.searched) {
        return (
          <View style={styles.container}>
            <TouchableHighlight onPress={this._onBack}>
              <View style={styles.backButton}>
                  <Text style={styles.buttonText}>Back</Text>
                </View>
            </TouchableHighlight>
            <Text style={styles.textTitle}>Search Results</Text>
              {/* <FlatList 
              data={this.state.books} 
              renderItem={ ({item}) => <Text style={styles.text}>{item.children.best_book.children[1]}</Text> }
            />   */}
              <ListView
                dataSource={this.state.books}
                renderRow={ (rowData) => <Text>{rowData.children[7].children[1]}</Text> }
              />
          </View>
        );
      }
      else {
        return (
          <View style={styles.container}>
            <Text style={styles.textTitle}>Search by Author, Title, or ISBN Below</Text>
            <TextInput 
              style={styles.textField}
              placeholder="Type Author, Title, or ISBN here"
              onChangeText={ (text) => this.setState({searchText: text}) }
            />
            <TouchableHighlight onPress={this._onButtonPress}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Search!</Text>
              </View>
            </TouchableHighlight>
          </View>
        );
      }
    } 
    
  }
}

const devKey = "MpiS3x0Qne6Vr0kYGv0ag"

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    alignItems: 'center',
  },
  button: {
    marginBottom: 30,
    width: 100,
    alignItems: 'center',
    backgroundColor: 'lightblue'
  },
  backButton: {
    marginBottom: 30,
    width: 75,
    height: 20,
    alignItems: 'center',
    backgroundColor: 'lightblue'
  },
  buttonText: {
    padding: 20,
    color: 'white'
  },
  textTitle: {
    fontSize: 20,
    marginBottom: 10
  },
  textField: {
    height: 40,
    borderColor: 'gray', 
    borderWidth: 1,
    padding: 10,
    marginBottom: 10
  },
  text: {
    fontSize: 15,
    marginBottom: 5
  }
})

